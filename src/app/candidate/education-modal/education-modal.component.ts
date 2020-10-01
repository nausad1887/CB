import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { NgForm } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-education-modal',
  templateUrl: './education-modal.component.html',
  styleUrls: ['./education-modal.component.css'],
})
export class EducationModalComponent implements OnInit {
  @Input() addEducation: boolean;
  @Input() editEducation: boolean;
  @Input() editableData: any;
  public searchWord = '';
  public universityLists = [];
  public degreeLists = [];
  public specialisationLists = [];
  public employeeData: any;
  public addAndEditEducationData = {
    loginemployeeID: '',
    degreeName: '',
    universityName: '',
    specialisationName: '',
    degreeID: '',
    universityID: '',
    specialisationID: '',
    empeducationYear: null,
    empeducationPer: '',
    empeducationID: '',
  };
  constructor(
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    public homeService: HomeService,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (this.editableData) {
      this.addAndEditEducationData.empeducationID = this.editableData.empeducationID;
      this.addAndEditEducationData.degreeID = this.editableData.degreeID;
      this.addAndEditEducationData.degreeName = this.editableData.degreeName;
      this.addAndEditEducationData.specialisationID = this.editableData.specialisationID;
      this.addAndEditEducationData.specialisationName = this.editableData.specialisationName;
      this.addAndEditEducationData.universityID = this.editableData.universityID;
      this.addAndEditEducationData.universityName = this.editableData.universityName;
      this.addAndEditEducationData.empeducationPer = this.editableData.empeducationPer;
      this.addAndEditEducationData.empeducationYear = this.editableData.empeducationYear;
    }
    this.checkStatus();
    this.getUniversityLists();
    this.getDegreeLists();
    this.getSpecialisationLists();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onCloseModal = () => {
    this.activeModal.close();
  }

  public onChangeUniversity = (universityID: any) => {
    if (
      universityID === undefined ||
      universityID === null ||
      universityID === ''
    ) {
      this.addAndEditEducationData.universityID = '';
      this.addAndEditEducationData.universityName = '';
    } else {
      this.universityLists.map((university) => {
        if (university.universityID === universityID) {
          this.addAndEditEducationData.universityName =
            university.universityName;
          this.addAndEditEducationData.universityID = university.universityID;
        }
      });
    }
  }

  public onChangeSpecialisation = (specialisationID: any) => {
    if (
      specialisationID === null ||
      specialisationID === undefined ||
      specialisationID === ''
    ) {
      this.addAndEditEducationData.specialisationID = '';
      this.addAndEditEducationData.specialisationName = '';
    } else {
      this.specialisationLists.map((specialisation) => {
        if (specialisation.specialisationID === specialisationID) {
          this.addAndEditEducationData.specialisationName =
            specialisation.specialisationName;
          this.addAndEditEducationData.specialisationID =
            specialisation.specialisationID;
        }
      });
    }
  }

  public onChangeDegree = (degreeID: any) => {
    if (degreeID === null || degreeID === undefined || degreeID === '') {
      this.addAndEditEducationData.degreeID = '';
      this.addAndEditEducationData.degreeName = '';
    } else {
      this.degreeLists.map((degree) => {
        if (degree.degreeID === degreeID) {
          this.addAndEditEducationData.degreeName = degree.degreeName;
          this.addAndEditEducationData.degreeID = degree.degreeID;
        }
      });
    }
  }

  public onYearChange = (year: any) => {
    if (year === null || year === undefined || year === '') {
      this.addAndEditEducationData.empeducationYear = null;
    } else {
      this.addAndEditEducationData.empeducationYear = year;
    }
  }

  public getUniversityLists = () => {
    const data = {searchWord: this.searchWord};
    this.candidateService.getUniversityLists(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.universityLists = response[0].data;
          this.universityLists.sort((a, b) => {
            const nameA = a.universityName.toUpperCase();
            const nameB = b.universityName.toUpperCase();
            if (nameA < nameB) {return -1; }
            if (nameA > nameB) {return 1; }
            return 0;
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

  public getDegreeLists = () => {
    const data = {searchWord: this.searchWord};
    this.candidateService.getDegreeLists(data).subscribe(
      (response) => {
        if (response.length > 0) {
          this.degreeLists = response;
          this.degreeLists.sort((a, b) => {
            const nameA = a.degreeName.toUpperCase();
            const nameB = b.degreeName.toUpperCase();
            if (nameA < nameB) {return -1; }
            if (nameA > nameB) {return 1; }
            return 0;
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

  public getSpecialisationLists = () => {
    const data = {searchWord: this.searchWord};
    this.candidateService.getSpecialisationLists(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.specialisationLists = response[0].data;
          this.specialisationLists.sort((a, b) => {
            const nameA = a.specialisationName.toUpperCase();
            const nameB = b.specialisationName.toUpperCase();
            if (nameA < nameB) {return -1; }
            if (nameA > nameB) {return 1; }
            return 0;
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

  public onSaveEducation = (form: NgForm) => {
    if (!this.addAndEditEducationData.degreeID) {
      this.toastr.warningToastr('Select Education', 'warning');
    } else if (!this.addAndEditEducationData.specialisationID) {
      this.toastr.warningToastr('Select Specialisation', 'warning');
    } else if (!this.addAndEditEducationData.universityID) {
      this.toastr.warningToastr('Select Board/University', 'warning');
    } else if (!this.addAndEditEducationData.empeducationYear) {
      this.toastr.warningToastr('Select Passing Year', 'warning');
    } else {
      this.spinner.show();
      this.addAndEditEducationData.loginemployeeID = this.employeeData.employeeID;
      this.candidateService
        .addEmployeeEducation(this.addAndEditEducationData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              form.resetForm();
              setTimeout(() => {
                this.spinner.hide();
                this.activeModal.close();
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
  }

  public onEditEducation = (form: NgForm) => {
    if (!this.addAndEditEducationData.degreeID) {
      this.toastr.warningToastr('Select Education', 'warning');
    } else if (!this.addAndEditEducationData.specialisationID) {
      this.toastr.warningToastr('Select Specialisation', 'warning');
    } else if (!this.addAndEditEducationData.universityID) {
      this.toastr.warningToastr('Select Board/University', 'warning');
    } else if (!this.addAndEditEducationData.empeducationYear) {
      this.toastr.warningToastr('Select Passing Year', 'warning');
    } else {
      this.spinner.show();
      this.addAndEditEducationData.loginemployeeID = this.employeeData.employeeID;
      this.candidateService
        .editEmployeeEducation(this.addAndEditEducationData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              form.resetForm();
              setTimeout(() => {
                this.spinner.hide();
                this.activeModal.close();
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
  }

  public deleteEducation = (empeducationID: string) => {
    this.spinner.show();
    const data = {empeducationID, loginemployeeID: this.employeeData.employeeID};
    this.candidateService.deleteEducation(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          this.toastr.successToastr('Deleted');
          setTimeout(() => {
            this.spinner.hide();
            this.activeModal.close();
          }, 1500);
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

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
