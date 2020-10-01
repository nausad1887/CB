import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-re-schedule-modal',
  templateUrl: './re-schedule-modal.component.html',
  styleUrls: ['./re-schedule-modal.component.css']
})
export class ReScheduleModalComponent implements OnInit {
  @Input() rescheduleData: any;
  public minDate: any;
  public employeeData: any;
  reschecduleForm: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    public homeService: HomeService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    public candidateService: CandidateService,
    fb: FormBuilder
  ) {
    this.reschecduleForm = fb.group({
      dateOfReschedule: ['', Validators.compose([Validators.required])],
      timeOfReschedule: ['', Validators.compose([Validators.required])],
      reasonsRemark: ['', Validators.compose([Validators.required, Validators.maxLength(200)]), ],
    });
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
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
  }
  public onClose() {
    this.activeModal.close();
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
        rescheduleBy: 'Employee',
        employeeID: this.employeeData.employeeID,
        employerID: this.rescheduleData.employerID,
        rescheduleStatusBy: 'Employee'
      };
      this.sendRequest(data).then((success: Array<any>) => {
        if (success[0].status === 'true'){
          setTimeout(() => {
            this.spinner.hide();
            this.activeModal.close();
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
      this.candidateService.reScheduleInterview(post).subscribe(
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
