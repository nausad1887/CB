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
  public interviewsRequests = [];
  public interviewsScheduled = [];
  public interviewsReScheduled = [];
  public interviewsDeclined = [];
  public interviewStatusLists = [];
  public loadingRequests = false;
  public loadingScheduled = false;
  public loadingDeclined = false;
  public loadingReScheduled = false;
  public noRecordFoundRequests = false;
  public noRecordFoundScheduled = false;
  public noRecordFoundDeclined = false;
  public noRecordFoundReScheduled = false;
  public errorOccuredRequests = false;
  public errorOccuredScheduled = false;
  public errorOccuredDeclined = false;
  public errorOccuredReScheduled = false;
  public pageSize = 4;
  public pageRequests = 1;
  public pageSchedule = 1;
  public pageReschedule = 1;
  public pageDeclined = 1;
  public closeResult: any;
  public bariz = 'Baariz';
  modalOption: NgbModalOptions = {}; //  not null!

  interviewsRequests$: Observable<Array<Interview>>;
  interviewsScheduled$: Observable<Array<Interview>>;
  interviewsReScheduled$: Observable<Array<Interview>>;
  interviewsDeclined$: Observable<Array<Interview>>;
  // handling unsubscriptions
  interviewsRequestsSub: Subscription;
  interviewsScheduledSub: Subscription;
  interviewsReScheduledSub: Subscription;
  interviewsDeclinedSub: Subscription;
  interviewStatusListsSubs: Subscription;

  constructor(
    public candidateService: CandidateService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    config: NgbPaginationConfig,
    private modalService: NgbModal
  ) {
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.loadingScheduled = true;
    this.loadingRequests = true;
    this.loadingReScheduled = true;
    this.loadingDeclined = true;
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.getInterviewStatusLists().then((success: Array<any>) => {
      if (success.length > 0) {
        this.interviewStatusLists = success;
      } else {
        this.interviewStatusLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.asyncFunction();
  }

  public asyncFunction = async () => {
    await this.getInterviewRequests()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.loadingRequests = false;
          this.interviewsRequests = this.sortByInterviewID(fulfilled);
        } else {
          this.interviewsRequests = [];
          this.loadingRequests = false;
          this.noRecordFoundRequests = true;
        }
      })
      .catch(() => {
        this.loadingRequests = false;
        this.noRecordFoundRequests = false;
        this.errorOccuredRequests = true;
      });
    await this.getInterviewScheduled()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.loadingScheduled = false;
          this.interviewsScheduled = this.sortByInterviewID(fulfilled);
        } else {
          this.interviewsScheduled = [];
          this.loadingScheduled = false;
          this.noRecordFoundScheduled = true;
        }
      })
      .catch(() => {
        this.loadingScheduled = false;
        this.noRecordFoundScheduled = false;
        this.errorOccuredScheduled = true;
      });
    await this.getInterviewReScheduled()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.loadingReScheduled = false;
          this.interviewsReScheduled = this.sortByInterviewID(fulfilled);
        } else {
          this.interviewsReScheduled = [];
          this.loadingReScheduled = false;
          this.noRecordFoundReScheduled = true;
        }
      })
      .catch(() => {
        this.loadingReScheduled = false;
        this.noRecordFoundReScheduled = false;
        this.errorOccuredReScheduled = true;
      });
    await this.getInterviewDeclined()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.loadingDeclined = false;
          this.interviewsDeclined = this.sortByStatusTime(fulfilled);
        } else {
          this.interviewsDeclined = [];
          this.loadingDeclined = false;
          this.noRecordFoundDeclined = true;
        }
      })
      .catch(() => {
        this.loadingDeclined = false;
        this.noRecordFoundDeclined = false;
        this.errorOccuredDeclined = true;
      });
  }
  public sortByInterviewID = (interview: Array<any>) => {
    interview.sort((a, b) => a.interviewID - b.interviewID);
    return interview.reverse();
  }
  public sortByStatusTime = (interview: Array<any>) => {
    interview.sort((a, b) => {
      a.statusDate = new Date(a.interviewStatusDateTime);
      b.statusDate = new Date(b.interviewStatusDateTime);
      if (a.statusDate.getTime() < b.statusDate.getTime()) { return -1; }
      if (a.statusDate.getTime() > b.statusDate.getTime()) { return 1; }
      return 0;
    });
    return interview.reverse();
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
  public getInterviewRequests = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '14', // for inprogress interview data
      };
      this.pageRequests = 1;
      this.interviewsRequests$ = this.candidateService.interviewsRequest(data);
      this.interviewsRequestsSub = this.interviewsRequests$.subscribe(
        (response) => {if (response[0].data[0].inprogress.length > 0) {
            resolve(response[0].data[0].inprogress);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public getInterviewScheduled = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '1', // for scheduled interview data
      };
      this.pageSchedule = 1;
      this.interviewsScheduled$ = this.candidateService.interviewsScheduled(data);
      this.interviewsScheduledSub = this.interviewsScheduled$.subscribe(
        (response) => {if (response[0].data[0].scheduled.length > 0) {
            resolve(response[0].data[0].scheduled);
          } else {resolve([]); }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public getInterviewReScheduled = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '3', // for Re-Scheduled interview data
      };
      this.pageReschedule = 1;
      this.interviewsReScheduled$ = this.candidateService.interviewsRescheduled(data);
      this.interviewsReScheduledSub = this.interviewsReScheduled$.subscribe(
        (response) => {if (response[0].data[0].reschedule.length > 0) {
            resolve(response[0].data[0].reschedule);
          } else {resolve([]); }
        },
        (error) => {reject(error); }
      );
    });
  }
  public getInterviewDeclined = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '7', // for declined by candidate interview data
      };
      this.pageDeclined = 1;
      this.interviewsDeclined$ = this.candidateService.interviewsDecline(data);
      this.interviewsDeclinedSub = this.interviewsDeclined$.subscribe(
        (response) => {if (response[0].data[0].rejected.length > 0) {
            resolve(response[0].data[0].rejected);
          } else {resolve([]); }
        },
        (error) => {reject(error); }
      );
    });
  }

  public requestTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }
  public scheduleTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }
  public reScheduledTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }
  public declineTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }

  public openDeclinedModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(DeclineModalComponent, this.modalOption);
    modalRef.componentInstance.declineData = data;
    modalRef.result.then(
      (result) => {
        setTimeout(() => { this.spinner.hide(); this.asyncFunction(); }, 500);
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
        setTimeout(() => { this.spinner.hide(); this.asyncFunction(); }, 500);
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

  public onDeclineClickInterview = (interviewID: string) => {
    const saveInterview = this.interviewsRequests.filter((interview) => interview.interviewID === interviewID);
    const data = {
      languageID: '1',
      loginemployerID: '0',
      interviewID: saveInterview[0].interviewID,
      reasonID: '',
      interviewRejectRemarks: '',
      rescheduleID: '0',
      rescheduleStatusBy: '',
      employeeID: saveInterview[0].employeeID,
      employerID: saveInterview[0].employerID,
      from: 'request',
    };
    this.openDeclinedModal(data);
  }
  public onAcceptClickInterview = (interviewID: string) => {
    this.spinner.show();
    const saveInterview = this.interviewsRequests.filter((interview) => interview.interviewID === interviewID);
    const data = {
      languageID: '1',
      loginemployerID: '0',
      interviewID: saveInterview[0].interviewID,
      rescheduleID: '0',
      rescheduleStatusBy: '',
      employeeID: saveInterview[0].employeeID,
      employerID: saveInterview[0].employerID,
    };
    this.candidateService.acceptInterview(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          setTimeout(() => { this.spinner.hide(); this.asyncFunction(); }, 500);
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
  public onRescheduleClickInterview = (interviewID: string) => {
    const saveInterview = this.interviewsRequests.filter(
      (interview) => interview.interviewID === interviewID
    );
    this.openRescheduleModal(saveInterview[0]);
  }
  // for schedule interview
  public onDeclineClickSchedule = (interviewID: string) => {
    const saveInterview = this.interviewsScheduled.filter((interview) => interview.interviewID === interviewID);
    const data = {
      languageID: '1',
      loginemployerID: '0',
      interviewID: saveInterview[0].interviewID,
      reasonID: '',
      interviewRejectRemarks: '',
      rescheduleID: '0',
      rescheduleStatusBy: '',
      employeeID: saveInterview[0].employeeID,
      employerID: saveInterview[0].employerID,
      from: 'schedule',
    };
    this.openDeclinedModal(data);
  }
  public onRescheduleClickSchedule = (interviewID: string) => {
    const saveInterview = this.interviewsScheduled.filter(
      (interview) => interview.interviewID === interviewID
    );
    this.openRescheduleModal(saveInterview[0]);
  }

  ngOnDestroy(): void {
    if (this.interviewsRequestsSub){this.interviewsRequestsSub.unsubscribe(); }
    if (this.interviewsScheduledSub){this.interviewsScheduledSub.unsubscribe(); }
    if (this.interviewsReScheduledSub){this.interviewsReScheduledSub.unsubscribe(); }
    if (this.interviewsDeclinedSub){this.interviewsDeclinedSub.unsubscribe(); }
    if (this.interviewStatusListsSubs){this.interviewStatusListsSubs.unsubscribe(); }
  }

}
