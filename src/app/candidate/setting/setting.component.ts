import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CandidateService } from '../candidate.service';
import { ConfirmedValidator } from 'src/app/reset-password-modal/confirmed.validator';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  public hide = true;
  passwordChangeForm: FormGroup;
  constructor(
    public homeService: HomeService,
    public snackBar: MatSnackBar,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public candidateService: CandidateService
  ) {
    this.passwordChangeForm = fb.group(
      {
        employeeCurrentPassword: ['', Validators.compose([Validators.required])],
        employeeNewPassword: ['', Validators.compose([Validators.required])],
        reEnterEmployeeNewPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validators: [
          ConfirmedValidator(
            'employeeNewPassword',
            'reEnterEmployeeNewPassword'
          ),
        ],
      }
    );
  }
  public employeeData: any;
  ngOnInit(): void {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
  }

  public myFunction() {
    this.hide = !this.hide;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public changePasswordClick = (post: any) => {
    this.markFormTouched(this.passwordChangeForm);
    if (this.passwordChangeForm.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployeeID: this.employeeData.employeeID,
        employeeCurrentPassword: post.employeeCurrentPassword,
        employeeNewPassword: post.employeeNewPassword,
      };
      this.changePassword(data).then((changed: Array<any>) => {
        this.spinner.hide();
        this.openSnackBar('Password successfully changed', 'success');
        setTimeout(() => {
          this.signOut();
        }, 1000);
      }).catch((error) => {
        this.spinner.hide();
        this.openSnackBar(error, 'error');
      });
    }
  }

  public changePassword = (data: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.employeeChangePassword(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public signOut = () => {
    // remove user data from local storage for log out
    if (this.homeService.getCurrentUserFromLocalStorage()) {
      this.homeService.removeLocalStorage();
      this.homeService.isCandidateTrue(false);
    } else {
      this.homeService.removeSessionStorage();
      this.homeService.isCandidateTrue(false);
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

  public onChangeemployeeNotifyJobStatus = (value: string) => {
    value === 'Yes'
      ? this.changeemployeeNotifyJobStatus('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.changeemployeeNotifyJobStatus('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }
  public onChangeemployeeNotifyAdminResponse = (value: string) => {
    value === 'Yes'
      ? this.changeemployeeNotifyAdminResponse('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.changeemployeeNotifyAdminResponse('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }
  public onChangeemployeeNotifyNewInterview = (value: string) => {
    value === 'Yes'
      ? this.changeemployeeNotifyNewInterview('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.changeemployeeNotifyNewInterview('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentUserFromLocalStorage() ?
          this.homeService.setCurrentUserInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentUserInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.spinner.hide();
          this.ngOnInit();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }

  public changeemployeeNotifyJobStatus = (value: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployeeID: this.employeeData.employeeID,
        employeeNotifyJobStatus: value,
        employeeNotifyNewInterview: this.employeeData.employeeNotifyNewInterview,
        employeeNotifyAdminResponse: this.employeeData.employeeNotifyAdminResponse,
      };
      this.candidateService.employeeUpdateNotificationSettings(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public changeemployeeNotifyNewInterview = (value: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployeeID: this.employeeData.employeeID,
        employeeNotifyJobStatus: this.employeeData.employeeNotifyJobStatus,
        employeeNotifyNewInterview: value,
        employeeNotifyAdminResponse: this.employeeData.employeeNotifyAdminResponse,
      };
      this.candidateService.employeeUpdateNotificationSettings(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public changeemployeeNotifyAdminResponse = (value: string) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployeeID: this.employeeData.employeeID,
        employeeNotifyJobStatus: this.employeeData.employeeNotifyJobStatus,
        employeeNotifyNewInterview: this.employeeData.employeeNotifyNewInterview,
        employeeNotifyAdminResponse: value,
      };
      this.candidateService.employeeUpdateNotificationSettings(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
