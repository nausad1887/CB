import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmedValidator } from 'src/app/reset-password-modal/confirmed.validator';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  public employerData: any;
  public hide = true;
  passwordChangeForm: FormGroup;
  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.passwordChangeForm = fb.group(
      {
        employerCurrentPassword: ['', Validators.compose([Validators.required])],
        employerNewPassword: ['', Validators.compose([Validators.required])],
        reEnterEmployerNewPassword: ['', Validators.compose([Validators.required])],
      },
      {
        validators: [
          ConfirmedValidator(
            'employerNewPassword',
            'reEnterEmployerNewPassword'
          ),
        ],
      }
    );
  }
  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
  }

  public myFunction() {
    this.hide = !this.hide;
  }

  public onSubmitChangePassword = (post: any) => {
    this.markFormTouched(this.passwordChangeForm);
    if (this.passwordChangeForm.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employerCurrentPassword: post.employerCurrentPassword,
        employerNewPassword: post.employerNewPassword,
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
      this.homeService.employerChangePassword(data).subscribe(
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

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public signOut = () => {
    // remove user data from local storage for log out
    if (this.homeService.getCurrentEmployerFromLocalStorage()) {
      this.homeService.removeEmployerLocalStorage();
      this.homeService.isEmployerTrue(false);
    } else {
      this.homeService.removeEmployerSessionStorage();
      this.homeService.isEmployerTrue(false);
    }
  }

  public onChangeemployerRescheduledNotify = (value: string) => {
    value === 'Yes'
      ? this.employerRescheduledNotify('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.employerRescheduledNotify('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }
  public onChangeemployerInterviewNotify = (value: string) => {
    value === 'Yes'
      ? this.employerInterviewNotify('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.employerInterviewNotify('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }
  public onChangeemployerSystemNotification = (value: string) => {
    value === 'Yes'
      ? this.employerSystemNotification('No').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      })
      : this.employerSystemNotification('Yes').then((fulfilled: Array<any>) => {
        this.homeService.getCurrentEmployerFromLocalStorage()
          ? this.homeService.setCurrentEmployerInLocalStorage(fulfilled[0]) :
          this.homeService.setCurrentEmployerInSessionStorage(fulfilled[0]);
        setTimeout(() => {
          this.ngOnInit();
          this.spinner.hide();
        }, 100);
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
  }

  public employerRescheduledNotify = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employerNotifyReschedule: value,
        employerNotifyInterview: this.employerData.employerNotifyInterview,
        employerNotifySystem: this.employerData.employerNotifySystem,
      };
      this.spinner.show();
      this.employerService.employerUpdateNotification(data).subscribe(
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

  public employerInterviewNotify = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employerNotifyReschedule: this.employerData.employerNotifyReschedule,
        employerNotifyInterview: value,
        employerNotifySystem: this.employerData.employerNotifySystem,
      };
      this.spinner.show();
      this.employerService.employerUpdateNotification(data).subscribe(
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

  public employerSystemNotification = (value: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employerNotifyReschedule: this.employerData.employerNotifyReschedule,
        employerNotifyInterview: this.employerData.employerNotifyInterview,
        employerNotifySystem: value,
      };
      this.spinner.show();
      this.employerService.employerUpdateNotification(data).subscribe(
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
