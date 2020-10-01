import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-jd-all',
  templateUrl: './post-jd-all.component.html',
  styleUrls: ['./post-jd-all.component.css'],
})
export class PostJdAllComponent implements OnInit {
  @Input() employeeName: string;
  @Input() employeeID: string;
  @Input() noticeName: string;
  @Input() empworkprofileName: string;
  @Input() cityName: string;
  @Input() empcertificateName: string;
  @Input() skills: Array<string>;
  @Input() employeeData: Array<any>;
  @Input() empkycExpYear: string;
  @Input() profilePic: string;
  @Input() jobjdID?: string;
  @Input() employerfavoriteID?: string;
  @Output() save = new EventEmitter();
  @Output() scheduleInterview = new EventEmitter();
  @Output() removeFromFavourite = new EventEmitter();
  @Output() download = new EventEmitter();
  @Output() showSharedStatus = new EventEmitter();
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  public notSelected = true;
  public selected = false;
  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    this.url = `${this.baseUrl}/${this.employeeID}/${this.profilePic}`;
  }

  public select = (employeeID: string) => {
    this.notSelected = !this.notSelected;
    this.selected = !this.selected;
    const data = {
      employeeID,
      jobjdID: this.jobjdID ? this.jobjdID : '0',
    };
    this.showSharedStatus.emit(data);
  }

  public deSelect = (employeeID: string) => {
    this.selected = !this.selected;
    this.notSelected = !this.notSelected;
    const data = {
      employeeID,
      jobjdID: this.jobjdID ? this.jobjdID : '0',
    };
    this.showSharedStatus.emit(data);
  }

  public onClickScheduleInterview = (employeeID: string) => {
    const data = {
      employeeID
    };
    this.scheduleInterview.emit(data);
  }
  public onClickAddToFavourite = (employeeID: string, jobjdID?: string) => {
    const data = {
      employeeID,
      jobjdID,
    };
    this.save.emit(data);
  }
  public onClickDownload = (employeeID: string) => {
    const data = {
      employeeID,
    };
    this.download.emit(data);
  }
  public onClickSave = (employeeID: string, jobjdID?: string) => {
    const data = {
      employeeID,
      jobjdID,
    };
    this.save.emit(data);
  }
  public onClickRemoveFromFavourite = (employeeID: string, employerfavoriteID: string) => {
    const temp = {
      employeeID,
      employerfavoriteID
    };
    this.removeFromFavourite.emit(temp);
  }
  public navigateToCandidateView = (employeeData: Array<any>) => {
    this.router.navigate(['/candidate-profile-view'], {
      state: {
        data: {
          jobjdID: this.jobjdID ? this.jobjdID : '0',
          employeeData
        }
      },
    });
  }
}
