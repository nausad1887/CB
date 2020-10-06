import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';
import { NgbPaginationConfig, NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeclineModalComponent } from '../decline-modal/decline-modal.component';
import { Interview } from 'src/app/candidateInterface';
import { Observable, Subscription } from 'rxjs';
import { ReScheduleModalComponent } from '../re-schedule-modal/re-schedule-modal.component';
@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
})
export class InterviewComponent implements OnInit, OnDestroy {
  public employeeData: any;
  public interviewStatusLists = [];
  public pageSize = 4;
  public pageRequests = 1;
  public pageSchedule = 1;
  public pageReschedule = 1;
  public pageDeclined = 1;
  public closeResult: any;
  public bariz = 'Baariz';
  modalOption: NgbModalOptions = {};
  public data = {
    languageID: '1',
    loginemployerID: '0',
    employeeID: '',
    employerID: '',
    type: 'Employee',
    jobjdID: '',
    interviewID: '',
    from: '',
  };

  interviewsRequests$: Observable<Array<Interview>>;
  interviewsScheduled$: Observable<Array<Interview>>;
  interviewsReScheduled$: Observable<Array<Interview>>;
  interviewsDeclined$: Observable<Array<Interview>>;
  // handling unsubscriptions
  interviewStatusListsSubs: Subscription;

  constructor(
    public candidateService: CandidateService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig,
    private modalService: NgbModal
  ) {
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.data.employeeID = this.employeeData.employeeID;
    this.getInterviewStatusLists().then((success: Array<any>) => {
      if (success.length > 0) {
        this.interviewStatusLists = success;
      } else {
        this.interviewStatusLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.interviewsRequests$ = this.candidateService.requests(this.data);
    this.interviewsScheduled$ = this.candidateService.schedule(this.data);
    this.interviewsReScheduled$ = this.candidateService.rescheduled(this.data);
    this.interviewsDeclined$ = this.candidateService.declined(this.data);
  }

  public getInterviewStatusLists = () => {
    return new Promise((resolve, reject) => {
      this.interviewStatusListsSubs = this.candidateService.getInterviewStatusLists().subscribe(
        (response) => {
          if (response[0].status === 'true') { resolve(response[0].data); } else { resolve([]); }
        },
        (error) => { reject(error); }
      );
    });
  }

  public requestTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public scheduleTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public reScheduledTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public declineTrackBy = (interview: any) => {
    return interview.interviewID;
  }

  public openDeclinedModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(DeclineModalComponent, this.modalOption);
    modalRef.componentInstance.declineData = data;
    modalRef.result.then(
      (result) => {
        setTimeout(() => { this.spinner.hide(); }, 500);
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openRescheduleModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ReScheduleModalComponent, this.modalOption);
    modalRef.componentInstance.rescheduleData = data;
    modalRef.result.then(
      (result) => {
        setTimeout(() => { this.spinner.hide(); }, 500);
        this.closeResult = `Closed with: ${result}`; },
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

  public onDeclineClickInterview = ($event: any) => {
    this.data.employeeID = $event.employeeID,
    this.data.employerID = $event.employerID;
    this.data.interviewID = $event.interviewID;
    this.data.from = 'request';
    this.openDeclinedModal(this.data);
  }
  public onAcceptClickInterview = ($event: any) => {
    this.spinner.show();
    this.data.employeeID = $event.employeeID,
    this.data.employerID = $event.employerID;
    this.data.interviewID = $event.interviewID;
    this.candidateService.acceptInterview(this.data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          setTimeout(() => { this.spinner.hide(); }, 500);
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
  public onRescheduleClickInterview = ($event: any) => {
    this.openRescheduleModal($event);
  }
  // for schedule interview
  public onDeclineClickSchedule = ($event: any) => {
    this.data.employeeID = $event.employeeID,
    this.data.employerID = $event.employerID;
    this.data.interviewID = $event.interviewID;
    this.openDeclinedModal(this.data);
  }
  public onRescheduleClickSchedule = ($event: any) => {
    this.openRescheduleModal($event);
  }

  ngOnDestroy(): void {
    if (this.interviewStatusListsSubs){this.interviewStatusListsSubs.unsubscribe(); }
  }

}
