import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeclineModalComponent } from '../decline-modal/decline-modal.component';
import { CandidateService } from '../candidate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from 'src/app/home.service';
import { Location } from '@angular/common';
import { ReScheduleModalComponent } from '../re-schedule-modal/re-schedule-modal.component';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  jobJD: any = history.state.data ? history.state.data.jobJD : [];
  companyName: string = history.state.data
    ? history.state.data.companyName
    : '';
  companyCity: string = history.state.data
    ? history.state.data.companyCity
    : '';
  jobJDname: string = history.state.data ? history.state.data.jobJDname : '';
  interviewDate: string = history.state.data
    ? history.state.data.interviewDate
    : '';
  interviewTime: string = history.state.data
    ? history.state.data.interviewTime
    : '';
  interviewMode: string = history.state.data
    ? history.state.data.interviewMode
    : '';
  employerID: string = history.state.data ? history.state.data.employerID : '';
  interviewID: string = history.state.data
    ? history.state.data.interviewID
    : '';
  interviewStatusID: string = history.state.data
    ? history.state.data.interviewStatusID
    : '';
  companyLogo: string = history.state.data
    ? history.state.data.companyLogo
    : '';
  routerUrl: string = history.state.data ? history.state.data.url : '';
  split = this.routerUrl.split('/');
  baseUrl = 'http://betaapplication.com/candidatebazar/backend/web/uploads';
  url = `${this.baseUrl}/${this.employerID}/${this.companyLogo}`;
  public acceptBoolean = true;
  public declineBoolean = true;
  public closeResult: any;
  public employeeData: any;
  modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService,
    private spinner: NgxSpinnerService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.routerUrl = this.split[1];
  }

  public backToPrevieous = () => {
    this.location.back();
  }

  public openDeclinedModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(DeclineModalComponent, this.modalOption);
    modalRef.componentInstance.declineData = data;
    modalRef.result.then(
      (result) => {
        if (result === 'request') { setTimeout(() => { this.declineBoolean = false; }, 1000); }
        if (result === 'schedule') { setTimeout(() => { this.declineBoolean = false; }, 1000); }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; });
  }
  public openRescheduleModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ReScheduleModalComponent, this.modalOption);
    modalRef.componentInstance.rescheduleData = data;
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public onAcceptClick = () => {
    this.spinner.show();
    const data = {
      languageID: '1',
      loginemployerID: '0',
      interviewID: this.interviewID,
      rescheduleID: '0',
      rescheduleStatusBy: '',
      employeeID: this.employeeData.employeeID,
      employerID: this.employerID,
    };
    this.candidateService.acceptInterview(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          setTimeout(() => {
            this.acceptBoolean = false;
          }, 1000);
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  public onRescheduleClick = () => {
    const data = {
      interviewID: this.interviewID,
      employeeID: this.employeeData.employeeID,
      employerID: this.employerID,
      interviewmodeName: this.interviewMode
    };
    this.openRescheduleModal(data);
  }
  public onDeclineClick = () => {
    const data = {
      languageID: '1',
      loginemployerID: '0',
      interviewID: this.interviewID,
      reasonID: '',
      interviewRejectRemarks: '',
      rescheduleID: '0',
      rescheduleStatusBy: '',
      employeeID: this.employeeData.employeeID,
      employerID: this.employerID,
    };
    this.openDeclinedModal(data);
  }
}
