import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-re-scheduled',
  templateUrl: './shared-re-scheduled.component.html',
  styleUrls: ['./shared-re-scheduled.component.css'],
})
export class SharedReScheduledComponent implements OnInit {
  @Input() employeeName: string;
  @Input() employeeID: string;
  @Input() employeeWork: string;
  @Input() jobJDname: string;
  @Input() interviewDate: string;
  @Input() interviewTime: string;
  @Input() interviewMode: string;
  @Input() interviewID: string;
  @Input() profilePic: string;
  @Input() rescheduledID: string;
  @Input() rescheduleRemarks: string;
  @Input() reScheduledInterviewDate: string;
  @Input() reScheduledInterviewTime: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public comment = false;
  @Output() declineRescheduled: EventEmitter<any> = new EventEmitter();
  @Output() acceptRescheduled: EventEmitter<any> = new EventEmitter();
  @Output() reschedule: EventEmitter<any> = new EventEmitter();
  constructor() { }
  ngOnInit(): void {
    this.interviewTime = this.tConvert(this.interviewTime);
    this.reScheduledInterviewTime.length === 0 &&
      this.reScheduledInterviewDate.length === 0
      ? this.makeEmpty()
      : (this.reScheduledInterviewTime = this.tConvert(
        this.reScheduledInterviewTime
      ));
    this.url = `${this.baseUrl}/${this.employeeID}/${this.profilePic}`;
  }

  public makeEmpty = () => {
    this.reScheduledInterviewDate = '';
    this.reScheduledInterviewTime = '';
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

  public onDeclineClick = (interviewID: string, rescheduledID: string) => {
    const data = {
      interviewID,
      rescheduledID,
    };
    this.declineRescheduled.emit(data);
  }
  public onAcceptClick = (interviewID: string, rescheduledID: string) => {
    const data = {
      interviewID,
      rescheduledID,
    };
    this.acceptRescheduled.emit(data);
  }
  public onRescheduleClick = (interviewID: string, rescheduledID: string) => {
    const data = {
      interviewID,
      rescheduledID,
    };
    this.reschedule.emit(data);
  }

  public showComment = () => {
    this.comment = !this.comment;
  }
}
