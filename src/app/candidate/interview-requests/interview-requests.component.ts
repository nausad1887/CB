import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-interview-requests',
  templateUrl: './interview-requests.component.html',
  styleUrls: ['./interview-requests.component.css'],
})
export class InterviewRequestsComponent implements OnInit {
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
  @Input() employeeID: string;
  @Input() interviewStatusID: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public closeResult: any;
  public defaultLogo =
    'src/assets/images/112815953-stock-vector-no-image-available-icon-flat-vector.jpg';
  public statusData = {
    languageID: '1',
    loginemployerID: '',
    interviewID: '',
    employeeID: '',
    employerID: '',
    interviewmodeName: ''
  };
  @Output() declineInterview: EventEmitter<any> = new EventEmitter();
  @Output() acceptInterview: EventEmitter<any> = new EventEmitter();
  @Output() rescheduleInterview: EventEmitter<any> = new EventEmitter();
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
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
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
    this.router.navigate(['/dashboard/job-details'], {
      state: {
        data,
      },
    });
  }

  public onDeclineClick = (interviewID: string, employeeID: string, employerID: string) => {
    this.statusData.interviewID = interviewID;
    this.statusData.employeeID = employeeID;
    this.statusData.employerID = employerID;
    this.declineInterview.emit(this.statusData);
  }
  public onAcceptClick = (interviewID: string, employeeID: string, employerID: string) => {
    this.statusData.interviewID = interviewID;
    this.statusData.employeeID = employeeID;
    this.statusData.employerID = employerID;
    this.acceptInterview.emit(this.statusData);
  }
  public onRescheduleClick = (interviewID: string, employeeID: string, employerID: string, interviewmodeName: string) => {
    this.statusData.interviewID = interviewID;
    this.statusData.employeeID = employeeID;
    this.statusData.employerID = employerID;
    this.statusData.interviewmodeName = interviewmodeName;
    this.rescheduleInterview.emit(this.statusData);
  }
}
