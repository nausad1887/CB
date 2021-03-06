import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-interviewed',
  templateUrl: './shared-interviewed.component.html',
  styleUrls: ['./shared-interviewed.component.css'],
})
export class SharedInterviewedComponent implements OnInit {
  @Input() companyName: string;
  @Input() companyCity: string;
  @Input() jobJD: any;
  @Input() jobJDname: string;
  @Input() interviewDate: string;
  @Input() interviewTime: string;
  @Input() interviewID: string;
  @Input() interviewMode: string;
  @Input() companyLogo: string;
  @Input() employerID: string;
  @Input() interviewStatusID: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public statusData = {
    languageID: '1',
    loginemployerID: '',
    interviewID: '',
    employeeID: '',
    employerID: '',
  };
  @Output() acceptSelectedJob: EventEmitter<any> = new EventEmitter();
  @Output() declineSelectedJob: EventEmitter<any> = new EventEmitter();
  constructor(private snackBar: MatSnackBar, private router: Router) {}
  ngOnInit(): void {
    this.interviewTime = this.tConvert(this.interviewTime);
    this.url = `${this.baseUrl}/${this.employerID}/${this.companyLogo}`;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  public tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
  }
  // navigating to details page
  public navigateToDetailsPage = (
    jobJD: any,
    companyName: string,
    companyCity: string,
    jobJDname: string,
    interviewDate: string,
    interviewTime: string,
    interviewMode: string,
    employerID: string,
    interviewID: string,
    interviewStatusID: string,
    companyLogo: string
  ) => {
    const data = {
      jobJD,
      companyName,
      companyCity,
      jobJDname,
      interviewDate,
      interviewTime,
      interviewMode,
      employerID,
      interviewID,
      interviewStatusID,
      companyLogo,
      url: this.router.url,
    };
    this.router.navigate(['/job-status/job-details'], {
      state: {
        data,
      },
    });
  }
}
