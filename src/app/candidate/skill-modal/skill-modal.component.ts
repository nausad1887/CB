import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSkillsData, Skill } from 'src/app/candidateInterface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-skill-modal',
  templateUrl: './skill-modal.component.html',
  styleUrls: ['./skill-modal.component.css'],
})
export class SkillModalComponent implements OnInit {
  @Input() primary: boolean;
  @Input() secondary: boolean;
  @Input() other: boolean;
  @Input() primarySkills: Array<any>;
  @Input() secondarySkills: Array<any>;
  @Input() otherSkills: Array<any>;
  priskillsForm: FormGroup;
  secskillsForm: FormGroup;
  othskillsForm: FormGroup;
  skillslist$: Observable<Array<Skill>>;
  public employeeData: any;
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.priskillsForm = this.fb.group({
      primarySkills: [this.primarySkills.length > 0 ? this.primarySkills : [], Validators.compose([])],
    });
    this.secskillsForm = this.fb.group({
      secondarySkills: [this.secondarySkills.length > 0 ? this.secondarySkills : [], Validators.compose([])],
    });
    this.othskillsForm = this.fb.group({
      othersSkills: [this.otherSkills.length > 0 ? this.otherSkills : [], Validators.compose([])],
    });
    // method calls
    this.checkStatus();
    this.skillslist$ = this.candidateService.skills;
  }

  public onModalClose = () => {
    this.activeModal.close();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }
  public onSaveSecondary = (post: any) => {
    if (post.secondarySkills.length > 0) {
      this.spinner.show();
      const data: AddSkillsData = {
        loginemployeeID: this.employeeData.employeeID,
        skilldetails: post.secondarySkills.map((skill: { skillName: string; skillID: string; }) => {
          return {
            skillName: skill.skillName,
            empskillType: 'Secondary',
            empworkprofileID: this.employeeData.employeeID,
            skillID: skill.skillID
          };
        }),
      };
      this.candidateService.addSkill(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
            }, 2000);
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
  }
  public onSaveOther = (post: any) => {
    if (post.othersSkills.length > 0) {
      this.spinner.show();
      const data: AddSkillsData = {
        loginemployeeID: this.employeeData.employeeID,
        skilldetails: post.othersSkills.map((skill: { skillName: string; skillID: string; }) => {
          return {
            skillName: skill.skillName,
            empskillType: 'Other',
            empworkprofileID: this.employeeData.employeeID,
            skillID: skill.skillID
          };
        }),
      };
      this.candidateService.addSkill(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
            }, 2000);
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
  }
  public onSavePrimary = (post: any) => {
    if (post.primarySkills.length > 0) {
      this.spinner.show();
      const data: AddSkillsData = {
        loginemployeeID: this.employeeData.employeeID,
        skilldetails: post.primarySkills.map((skill: { skillName: string; skillID: string; }) => {
        return {
          skillName: skill.skillName, empskillType: 'Primary', empworkprofileID: this.employeeData.employeeID, skillID: skill.skillID};
        })
      };
      this.candidateService.addSkill(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
            }, 2000);
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
  }

  public onRemovePrimary($event: any) {
    if (this.primarySkills.find((skill) => skill.skillID === $event.value.skillID)) {
      this.deleteSkill(this.primarySkills.filter(skill => skill.skillID === $event.value.skillID)).then((response: Array<any>) => {
        if (response.length > 0) {
          this.updateData(response);
          const index = this.primarySkills.map((skill) => skill.skillID).indexOf($event.value.skillID);
          this.primarySkills.splice(index, 1);
        }
      });
    }
  }
  public onRemoveSecondary($event: any) {
    if (this.secondarySkills.find((skill) => skill.skillID === $event.value.skillID)) {
      this.deleteSkill(this.secondarySkills.filter(skill => skill.skillID === $event.value.skillID)).then((response: Array<any>) => {
        if (response.length > 0) {
          this.updateData(response);
          const index = this.secondarySkills.map((skill) => skill.skillID).indexOf($event.value.skillID);
          this.secondarySkills.splice(index, 1);
        }
      });
    }
  }
  public onRemoveOther($event: any) {
    if (this.otherSkills.find((skill) => skill.skillID === $event.value.skillID)) {
      this.deleteSkill(this.otherSkills.filter(skill => skill.skillID === $event.value.skillID)).then((response: Array<any>) => {
        if (response.length > 0) {
          this.updateData(response);
          const index = this.otherSkills.map((skill) => skill.skillID).indexOf($event.value.skillID);
          this.otherSkills.splice(index, 1);
        }
      });
    }
  }

  public deleteSkill = (data: Array<any>) => {
    return new Promise((resolve, reject) => {
      const deleteData = { loginemployeeID: this.employeeData.employeeID, empskillID: data[0].empskillID };
      this.candidateService.deleteSkill(deleteData).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else { resolve([]); }
        }, error => { reject(error); }
      );
    });
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
