import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-update-profile-modal',
  templateUrl: './update-profile-modal.component.html',
  styleUrls: ['./update-profile-modal.component.css'],
})
export class UpdateProfileModalComponent implements OnInit {
  @Input() employeeDetails: any;
  personalAddEditForm: FormGroup;
  public employeeData: any;
  public maritalStatus = [
    {
      id: '1',
      value: 'Un-Married',
    },
    {
      id: '2',
      value: 'Married',
    },
    {
      id: '3',
      value: 'Divorced',
    },
  ];
  public gender = [
    {
      id: '1',
      value: 'Male',
    },
    {
      id: '2',
      value: 'Female',
    },
    {
      id: '3',
      value: 'Other',
    },
  ];
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.personalAddEditForm = this.fb.group({
      employeeName: [
        this.employeeDetails.employeeName
          ? this.employeeDetails.employeeName
          : '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
        ]),
      ],
      employeeEmail: [
        this.employeeDetails.employeeEmail
          ? this.employeeDetails.employeeEmail
          : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
      employeeDOB: [
        this.employeeDetails.employeeDOB
          ? this.employeeDetails.employeeDOB
          : '',
        Validators.compose([Validators.required]),
      ],
      currentAddPer: [
        this.employeeDetails.employeeCurrentAddress
          ? this.employeeDetails.employeeCurrentAddress
          : '',
        Validators.compose([Validators.required]),
      ],
      parmanentAddress: [
        this.employeeDetails.employeePermanantAddress
          ? this.employeeDetails.employeePermanantAddress
          : '',
        Validators.compose([Validators.required]),
      ],
    });

    if (this.employeeDetails) {
      this.employeeData = this.employeeDetails;
    }
    this.checkStatus();
  }
  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public onCloseModal = () => {
    this.activeModal.close();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onClickChangeMaritalStatus = (status: string) => {
    this.employeeData.employeeMartialStatus = status;
  }

  public onClickChangeGender = (gender: string) => {
    this.employeeData.employeeGender = gender;
  }

  public updateEmployeePersonalDetails = (post: any) => {
    this.markFormTouched(this.personalAddEditForm);
    if (this.personalAddEditForm.valid) {
      this.spinner.show();
      const data = {
        loginemployeeID: `${this.employeeData.employeeID}`,
        employeeName: `${post.employeeName}`,
        employeeEmail: `${post.employeeEmail}`,
        employeeProfilePicture: `${this.employeeData.employeeProfilePicture}`,
        employeeDOB: `${post.employeeDOB}`,
        employeeGender: `${this.employeeData.employeeGender}`,
        employeeCurrentAddress: `${post.currentAddPer}`,
        employeePermanantAddress: `${post.parmanentAddress}`,
        employeeMartialStatus: `${this.employeeData.employeeMartialStatus}`,
      };
      this.candidateService.employeeUpdateProfile(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close(response[0].data);
            }, 1000);
          } else if (response[0].message === 'Email already exist.') {
            this.spinner.hide();
            this.personalAddEditForm.controls.employeeEmail.setErrors({
              emailAlreadyExist: true,
            });
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
    }
  }

  public markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.updateComponents(data);
    }, 500);
  }

  public updateComponents = (data: any) => {
    this.candidateService.updateComponents(data);
  }
}
