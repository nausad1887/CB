import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';
import { Subscription, Subject, of } from 'rxjs';
import {map, debounceTime, distinctUntilChanged, mergeMap, delay} from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AddSkillsData } from 'src/app/candidateInterface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-workprofile-modal',
  templateUrl: './workprofile-modal.component.html',
  styleUrls: ['./workprofile-modal.component.css'],
})
export class WorkprofileModalComponent implements OnInit {
  @Input() addWorkProfile: boolean;
  @Input() editWorkProfile: boolean;
  @Input() editableData: any;
  public employeeData: any;
  public searchArea: string;
  public skillsLists = [];
  public selectedPrimarySkills = [];
  public addedListsSkill = [];
  public workProfileData = {
    loginemployeeID: '',
    empworkprofileID: '',
    empworkprofileName: '',
  };
  public subscription: Subscription;
  public keyUpPrimary = new Subject<KeyboardEvent>();
  constructor(
    public candidateService: CandidateService,
    public homeService: HomeService,
    public activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.subscription = this.keyUpPrimary
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchArea = input;
        this.searchArea ? this.getSkillsLists() : (this.skillsLists = []);
      });
  }

  ngOnInit(): void {
    if (this.editableData) {
      this.workProfileData.empworkprofileName = this.editableData.empworkprofileName;
      this.workProfileData.empworkprofileID = this.editableData.empworkprofileID;
      this.workProfileData.loginemployeeID = this.editableData.employeeID;
      this.addedListsSkill = this.editableData.skills;
    }
    this.checkStatus();
  }

  public onSaveAddWorkProfile = (form: NgForm) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      empworkprofileName: this.workProfileData.empworkprofileName,
    };
    this.candidateService.addWorkProfile(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          for (const profile of response[0].data[0].workprofiles) {
            if (
              profile.empworkprofileName ===
              this.workProfileData.empworkprofileName
            ) {
              this.workProfileData.empworkprofileID = profile.empworkprofileID;
              this.selectedPrimarySkills.map((skills) => {
                skills.empworkprofileID = this.workProfileData.empworkprofileID;
              });
              this.onSaveSkills();
            }
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public selectSkills = (data: any) => {
    const skillDetailsdata = {
      skillName: data.skillName,
      empskillType: '',
      empworkprofileID: this.workProfileData.empworkprofileID,
      skillID: data.skillID,
    };
    if (this.selectedPrimarySkills.indexOf(skillDetailsdata) === -1) {
      this.selectedPrimarySkills.push(skillDetailsdata);
    }
  }

  public popOutPrimary = (index: any) => {
    this.selectedPrimarySkills.map((unSelect) => {
      if (this.selectedPrimarySkills.indexOf(unSelect) === index) {
        this.selectedPrimarySkills.splice(index, 1);
      }
    });
  }

  public popOutSkill = (index: any) => {
    this.addedListsSkill.map((unSelect) => {
      if (this.addedListsSkill.indexOf(unSelect) === index) {
        this.addedListsSkill.splice(index, 1);
      }
    });
  }

  public onModalClose = () => {
    this.activeModal.close();
  }

  public onSaveSkills = () => {
    const data: AddSkillsData = {
      loginemployeeID: this.employeeData.employeeID,
      skilldetails: this.selectedPrimarySkills,
    };
    this.candidateService.addSkill(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          setTimeout(() => {
            this.activeModal.close();
          }, 1000);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public onSaveEditWorkProfile = (edit: NgForm) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.workProfileData.loginemployeeID,
      empworkprofileName: this.workProfileData.empworkprofileName,
      empworkprofileID: this.workProfileData.empworkprofileID,
    };
    this.candidateService.editWorkProfile(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          for (const profile of response[0].data[0].workprofiles) {
            if (
              profile.empworkprofileName ===
              this.workProfileData.empworkprofileName
            ) {
              this.workProfileData.empworkprofileID = profile.empworkprofileID;
              this.selectedPrimarySkills.map((skills) => {
                skills.empworkprofileID = this.workProfileData.empworkprofileID;
              });
              this.onSaveSkills();
            }
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
        this.spinner.hide();
      }
    );
  }

  public getSkillsLists = () => {
    this.skillsLists = [];
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      searchWord: this.searchArea ? this.searchArea : '',
    };
    this.candidateService.getSkillsLists(data).subscribe(
      (response) => {
        if (response.length > 0) {
          this.skillsLists = response;
          this.skillsLists.sort((a, b) => {
            return a.skillID - b.skillID;
          });
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
      this.updateComponents(data);
    }, 500);
  }

  public updateComponents = (data: any) => {
    this.candidateService.updateComponents(data);
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onDeleteWorkProfile = (empworkprofileID: string) => {
    this.spinner.show();
    this.candidateService.deleteWorkProfile(this.workProfileData).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          setTimeout(() => {
            this.spinner.hide();
            this.activeModal.close();
            this.openSnackBar('Record Deleted!', 'success');
          }, 1000);
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public deleteSkill = (data: any) => {
    const deleteData = {
      loginemployeeID: this.employeeData.employeeID,
      empskillID: data.empskillID,
    };
    this.candidateService.deleteSkill(deleteData).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          this.openSnackBar('removed', 'true');
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
