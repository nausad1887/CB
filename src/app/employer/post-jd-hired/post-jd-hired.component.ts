import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-jd-hired',
  templateUrl: './post-jd-hired.component.html',
  styleUrls: ['./post-jd-hired.component.css'],
})
export class PostJdHiredComponent implements OnInit {
  @Input() employeeName: string;
  @Input() employeeID: string;
  @Input() interviewID: string;
  @Input() employeeWork: string;
  @Input() jobJDname: string;
  @Input() interviewDate: string;
  @Input() interviewTime: string;
  @Input() interviewStatusDateTime: string;
  @Input() interviewMode: string;
  @Input() profilePic: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
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
}
