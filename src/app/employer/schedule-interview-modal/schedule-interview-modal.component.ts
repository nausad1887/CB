import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { StateListData } from 'src/app/candidateInterface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-schedule-interview-modal',
  templateUrl: './schedule-interview-modal.component.html',
  styleUrls: ['./schedule-interview-modal.component.css']
})
export class ScheduleInterviewModalComponent implements OnInit {
  @Input() employeeID: string;
  scheduleInterviewForm: FormGroup;
  public employerData: any;
  public jobJDlist = [];
  public jobJDlistActive = [];
  public interviewMode = [];
  public cityLists = [];
  public stateLists = [];
  public loading = false;
  public showMode: string;
  public onChangeLoadingGif = false;
  public noRecordFoundActive = false;
  public noRecordFound = false;
  public minDate: any;
  interviewModeLists$: Observable<Array<any>>;
  constructor(
    private activeModal: NgbActiveModal,
    private employerService: EmployerService,
    private homeService: HomeService,
    public fb: FormBuilder,
    public router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) {
    // for disabling previous dates from current date
    let month: any;
    let day: any;
    const dtToday = new Date();
    month = dtToday.getMonth() + 1;
    day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    this.minDate = year + '-' + month + '-' + day;
  }

  ngOnInit(): void {
    this.scheduleInterviewForm = this.fb.group({
      typeOfJD: [null, Validators.compose([Validators.required])],
      dateOfInterview: ['', Validators.compose([Validators.required])],
      timeOfInterview: ['', Validators.compose([Validators.required])],
      interviewMode: ['', Validators.compose([Validators.required])],
      contactfullName: [''],
      contactOrLink: [''],
      // for personal interview
      officeNumber: [''],
      addressLine2: [''],
      addressLine1: [''],
      interviewState: [null],
      interviewCity: [null],
      pinCode: [''],
    });
    this.loading = true;
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage() ?
      this.homeService.getCurrentEmployerFromLocalStorage() :
      this.homeService.getCurrentEmployerFromSessionStorage();
    this.getJobJDlist().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.jobJDlist = fulfilled;
        this.getActiveJDs(this.jobJDlist);
        this.loading = false;
      } else {
        this.loading = false;
        this.noRecordFound = true;
      }
    }).catch((error) => {
      this.loading = false;
      console.error(error);
    });
    this.getInterviewModelist().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.interviewMode = fulfilled;
      } else {
        this.interviewMode = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getStateList().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.stateLists = fulfilled;
        this.stateLists.sort((a, b) => {
          return a.stateID - b.stateID;
        });
      } else {
        this.stateLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  onClose() {
    this.activeModal.close();
  }

  public onChangeState = (stateID: string) => {
    this.cityLists = [];
    this.scheduleInterviewForm.get('interviewCity').patchValue(null);
    this.onChangeLoadingGif = true;
    this.getCities(stateID).then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.cityLists = fulfilled;
        this.cityLists.sort((a, b) => {
          return a.cityID - b.cityID;
        });
        this.onChangeLoadingGif = false;
      } else {
        this.cityLists = [];
        this.onChangeLoadingGif = false;
      }
    }).catch((error) => {
      this.onChangeLoadingGif = false;
      console.error(error);
    });
  }

  public onChangeInterviewMode = (modeID: string) => {
    // for in personal
    if (this.interviewModeDetails(modeID)[0].interviewmodeName === 'In Personal') {
      this.showMode = this.interviewModeDetails(modeID)[0].interviewmodeName;
      this.clearValidatorsOfSkypeInterviewMode();
      this.scheduleInterviewForm.get('officeNumber')
        .setValidators([Validators.compose([Validators.required])]);
      this.scheduleInterviewForm.get('addressLine1')
        .setValidators([Validators.compose([Validators.required, Validators.minLength(3),
        Validators.maxLength(60)])]);
      this.scheduleInterviewForm.get('addressLine2')
        .setValidators([Validators.compose([Validators.required, Validators.minLength(3),
        Validators.maxLength(60)])]);
      this.scheduleInterviewForm.get('interviewState')
        .setValidators([Validators.compose([Validators.required])]);
      this.scheduleInterviewForm.get('interviewCity')
        .setValidators([Validators.compose([Validators.required])]);
      this.scheduleInterviewForm.get('pinCode')
        .setValidators([Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]);
      this.scheduleInterviewForm.get('contactfullName')
        .setValidators([Validators.compose([Validators.required, Validators.minLength(3),
        Validators.maxLength(30)])]);
      this.scheduleInterviewForm.get('contactfullName').updateValueAndValidity();
      this.scheduleInterviewForm.get('officeNumber').updateValueAndValidity();
      this.scheduleInterviewForm.get('addressLine1').updateValueAndValidity();
      this.scheduleInterviewForm.get('addressLine2').updateValueAndValidity();
      this.scheduleInterviewForm.get('interviewState').updateValueAndValidity();
      this.scheduleInterviewForm.get('interviewCity').updateValueAndValidity();
      this.scheduleInterviewForm.get('pinCode').updateValueAndValidity();
    }
    // for skype
    if (this.interviewModeDetails(modeID)[0].interviewmodeName === 'Skype') {
      this.showMode = this.interviewModeDetails(modeID)[0].interviewmodeName;
      this.clearValidatorsOfInPersonalInterviewMode();
      this.scheduleInterviewForm.get('contactfullName')
        .setValidators([Validators.compose([Validators.required, Validators.minLength(3),
        Validators.maxLength(30)])]);
      this.scheduleInterviewForm.get('contactOrLink')
        .setValidators([Validators.compose([Validators.required])]);
      this.scheduleInterviewForm.get('contactfullName').updateValueAndValidity();
      this.scheduleInterviewForm.get('contactOrLink').updateValueAndValidity();
    }
  }

  public clearValidatorsOfInPersonalInterviewMode = () => {
    this.scheduleInterviewForm.get('officeNumber').clearValidators();
    this.scheduleInterviewForm.get('addressLine1').clearValidators();
    this.scheduleInterviewForm.get('addressLine2').clearValidators();
    this.scheduleInterviewForm.get('interviewState').clearValidators();
    this.scheduleInterviewForm.get('interviewCity').clearValidators();
    this.scheduleInterviewForm.get('pinCode').clearValidators();
    this.scheduleInterviewForm.get('officeNumber').updateValueAndValidity();
    this.scheduleInterviewForm.get('addressLine1').updateValueAndValidity();
    this.scheduleInterviewForm.get('addressLine2').updateValueAndValidity();
    this.scheduleInterviewForm.get('interviewState').updateValueAndValidity();
    this.scheduleInterviewForm.get('interviewCity').updateValueAndValidity();
    this.scheduleInterviewForm.get('pinCode').updateValueAndValidity();
  }

  public clearValidatorsOfSkypeInterviewMode = () => {
    this.scheduleInterviewForm.get('contactOrLink').clearValidators();
    this.scheduleInterviewForm.get('contactOrLink').updateValueAndValidity();
  }

  public interviewModeDetails = (modeID: string) => {
    return this.interviewMode.filter(mode => mode.interviewmodeID === modeID);
  }

  public schedule = (post: any) => {
    this.markFormTouched(this.scheduleInterviewForm);
    if (this.scheduleInterviewForm.valid && this.findInvalidControls().length === 0) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        jobroleID: '0',
        jobjdID: post.typeOfJD,
        employeeID: this.employeeID,
        interviewDate: post.dateOfInterview,
        interviewTime: this.convertTime12to24(post.timeOfInterview),
        interviewmodeID: post.interviewMode,
        interviewContactName: post.contactfullName,
        interviewOfficeNo: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.officeNumber : 'undefined',
        interviewAddress1: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.addressLine1 : '',
        interviewAddress2: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.addressLine2 : '',
        stateID: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.interviewState : '0',
        cityID: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.interviewCity : '0',
        interviewZipcode: this.interviewModeDetails(post.interviewMode)[0].interviewmodeName === 'In Personal' ? post.pinCode : '',
      };
      this.scheduleInterview(data).then((success: Array<any>) => {
        if (success.length > 0) {
          this.openSnackBar('Done', 'success');
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigate(['/interviews']);
          }, 2000);
        } else {
          setTimeout(() => {
            this.spinner.hide();
            window.alert(`Error!!!
            Required data is missing.`);
          }, 1000);
        }
      }).catch((error) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        console.error(error);
      });
    }
  }

  public scheduleInterview = (post: any) => {
    return new Promise((resolve, reject) => {
      this.employerService.scheduleInterview(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        }, error => {
          reject(error);
        }
      );
    });
  }

  // checking which form control is invalid
  public findInvalidControls() {
    const invalid = [];
    const controls = this.scheduleInterviewForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public getJobJDlist = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
      };
      this.employerService.listJobJd(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getStateList = () => {
    return new Promise((resolve, reject) => {
      const data: StateListData = {
        countryID: '0',
        searchWord: '',
      };
      this.employerService.getStateLists(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getCities = (selectedStateData: string) => {
    return new Promise((resolve, reject) => {
      const data = {
        countryID: '0',
        stateID: selectedStateData,
        searchWord: '',
      };
      this.employerService.cityLists(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getInterviewModelist = () => {
    return new Promise((resolve, reject) => {
      this.interviewModeLists$ = this.employerService.getInterviewModeLists;
      this.interviewModeLists$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getActiveJDs = (jobJDlist: Array<any>) => {
    this.jobJDlistActive = jobJDlist.filter(
      (jobJD) => jobJD.jobjdStatus === 'Active'
    );
    this.jobJDlistActive.length === 0
      ? (this.noRecordFoundActive = true)
      : (this.noRecordFoundActive = false);
  }

  // convert 12 hours to 24 hours
  public convertTime12to24 = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    // tslint:disable-next-line: prefer-const
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      const newHours = parseInt(hours, 10) + 12;
      hours = newHours.toString();
    }
    return `${hours}:${minutes}`;
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
}
