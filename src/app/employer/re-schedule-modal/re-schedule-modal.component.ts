import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeService } from 'src/app/home.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-re-schedule-modal',
  templateUrl: './re-schedule-modal.component.html',
  styleUrls: ['./re-schedule-modal.component.css']
})
export class ReScheduleModalComponent implements OnInit {
  @Input() rescheduleData: any;
  @Input() jobjdID?: string;
  public minDate: any;
  public employerData: any;
  public jobJDlist = [];
  public jobJDlistActive = [];
  reschecduleForm: FormGroup;
  interviewModeLists$: Observable<Array<any>>;
  constructor(
    private spinner: NgxSpinnerService,
    public homeService: HomeService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    public employerService: EmployerService,
    public fb: FormBuilder
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
    this.reschecduleForm = this.fb.group({
      typeOfJD: [{value: this.jobjdID ? this.jobjdID : null, disabled: this.jobjdID ? true : false}],
      interviewMode: [{value: this.rescheduleData.interviewMode ? this.rescheduleData.interviewMode : null,
         disabled: this.jobjdID ? true : false}],
      dateOfReschedule: ['', Validators.compose([Validators.required])],
      timeOfReschedule: ['', Validators.compose([Validators.required])],
      reasonsRemark: ['', Validators.compose([Validators.required, Validators.maxLength(200)]), ],
    });
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.getJobJDlist().then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.jobJDlist = fulfilled;
          this.getActiveJDs(this.jobJDlist);
        } else {
          this.jobJDlist = [];
        }
      }).catch((error) => {
        console.error(error);
      });
    this.interviewModeLists$ = this.employerService.getInterviewModeLists;
  }

  public getActiveJDs = (jobJDlist: Array<any>) => {
    this.jobJDlistActive = jobJDlist.filter((jobJD) => jobJD.jobjdStatus === 'Active');
  }
  public onClose() {
    this.activeModal.close();
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

  public onClickSendRequest = (post: any) => {
    this.markFormTouched(this.reschecduleForm);
    if (this.reschecduleForm.valid) {
      const data = {
        languageID: '1',
        interviewID: this.rescheduleData.interviewID,
        rescheduleDate: post.dateOfReschedule,
        rescheduleTime: post.timeOfReschedule,
        rescheduleRemarks: post.reasonsRemark,
        rescheduleBy: 'Employer',
        employeeID: this.rescheduleData.employeeID,
        employerID: this.employerData.employerID,
        rescheduleStatusBy: 'Employer'
      };
      this.sendRequest(data).then((success: Array<any>) => {
        if (success[0].status === 'true'){
          setTimeout(() => {
            this.spinner.hide();
            this.activeModal.close('RequestSent');
            this.openSnackBar('Request has been sent', 'success');
          }, 500);
        }else{
          setTimeout(() => {
            this.spinner.hide();
            this.openSnackBar('some error occured', 'success');
          }, 500);
        }
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
    }
  }
  public sendRequest = (post: any) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.employerService.reScheduleInterview(post).subscribe(
        (response) => {
          resolve(response);
        }, error => {
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

}
