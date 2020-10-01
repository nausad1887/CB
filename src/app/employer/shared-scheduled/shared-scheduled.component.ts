import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployerService } from '../employer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shared-scheduled',
  templateUrl: './shared-scheduled.component.html',
  styleUrls: ['./shared-scheduled.component.css'],
})
export class SharedScheduledComponent implements OnInit {
  @Input() employeeName: string;
  @Input() employeeID: string;
  @Input() interviewID: string;
  @Input() employeeWork: string;
  @Input() jobJDname: string;
  @Input() interviewDate: string;
  @Input() interviewTime: string;
  @Input() interviewMode: string;
  @Input() navItems: any = [];
  @Input() profilePic: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public statusData = {
    languageID: '1',
    loginemployerID: '',
    interviewID: '',
    interviewstatusID: '',
    interviewStatusRemarks: '',
    employeeID: '',
    employerID: '',
    interviewmodeName: ''
  };
  @Output() updateStatusData: EventEmitter<any> = new EventEmitter();
  constructor(
    public employerService: EmployerService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.interviewTime = this.tConvert(this.interviewTime);
    this.url = `${this.baseUrl}/${this.employeeID}/${this.profilePic}`;
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
  public onChangeRadio(interviewID: string, status: any, employeeID: string, interviewMode: string) {
    this.statusData.interviewID = interviewID;
    this.statusData.interviewstatusID = status.interviewstatusID;
    this.statusData.interviewStatusRemarks = `${status.interviewstatusApplicableTo} ${status.interviewstatusName}`;
    this.statusData.employeeID = employeeID;
    this.statusData.interviewmodeName = interviewMode;
  }
  public updateInterviewStatus = () => {
    this.statusData.interviewstatusID
      ? this.CallParent()
      : this.openSnackBar('Select any option', 'warning');
  }
  public CallParent = () => {
    this.updateStatusData.emit(this.statusData);
  }
}
