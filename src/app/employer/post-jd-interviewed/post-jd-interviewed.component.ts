import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-jd-interviewed',
  templateUrl: './post-jd-interviewed.component.html',
  styleUrls: ['./post-jd-interviewed.component.css'],
})
export class PostJdInterviewedComponent implements OnInit {
  @Input() employeeName: string;
  @Input() employeeID: string;
  @Input() interviewID: string;
  @Input() employeeWork: string;
  @Input() jobJDname: string;
  @Input() jobjdID: string;
  @Input() interviewDate: string;
  @Input() interviewTime: string;
  @Input() interviewStatusDateTime: string;
  @Input() interviewMode: string;
  @Input() profilePic: string;
  @Input() navItems: Array<string>;
  public baseUrl = 'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public statusData = {
    languageID: '1',
    loginemployerID: '',
    interviewID: '',
    interviewstatusID: '',
    interviewStatusRemarks: '',
    employeeID: '',
    employerID: '',
    jobjdID: '',
    interviewMode: ''
  };
  @Output() updateStatusData: EventEmitter<any> = new EventEmitter();
  @Output() scheduleNextRound: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.interviewTime = this.tConvert(this.interviewTime);
    this.url = `${this.baseUrl}/${this.employeeID}/${this.profilePic}`;
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

  public updateStatus(interviewID: string, status: any, jobjdID: string, employeeID: string, interviewMode: string) {
    this.statusData.interviewID = interviewID;
    this.statusData.interviewstatusID = status.interviewstatusID;
    this.statusData.jobjdID = jobjdID;
    this.statusData.interviewStatusRemarks = `${status.interviewstatusApplicableTo} ${status.interviewstatusName}`;
    this.statusData.employeeID = employeeID;
    this.statusData.interviewMode = interviewMode;
    status.interviewstatusID === '11' ? this.scheduleNextRound.emit(this.statusData) : this.updateStatusData.emit(this.statusData);
  }
}
