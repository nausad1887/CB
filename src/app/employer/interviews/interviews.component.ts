import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationConfig, NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeclineModalComponent } from 'src/app/candidate/decline-modal/decline-modal.component';
import { Observable, Subscription } from 'rxjs';
import { Interview } from 'src/app/candidateInterface';
import { ReScheduleModalComponent } from '../re-schedule-modal/re-schedule-modal.component';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
})
export class InterviewsComponent implements OnInit, OnDestroy {
  public employerData: any;
  public interviewStatusLists: any = [];
  public scheduledNavItems: any = [];
  public inProcessNavItems: any = [];
  public reScheduledNavItems: any = [];
  public searchTexts: string;
  public searchTextProcess: string;
  public searchTextRescheduled: string;
  public searchTextUnavailable: string;
  public pageSize = 4;
  public pageProgress = 1;
  public pageSchedule = 1;
  public pageReschedule = 1;
  public pageUnavailable = 1;
  public closeResult: any;
  modalOption: NgbModalOptions = {}; //  not null!
  public data = {
    languageID: '1',
    loginemployerID: '',
    employeeID: '',
    type: 'Employer',
    jobjdID: ''
  };

  interviewsProcess$: Observable<Array<Interview>>;
  interviewsScheduled$: Observable<Array<Interview>>;
  interviewsReScheduled$: Observable<Array<Interview>>;
  interviewsUnavailable$: Observable<Array<Interview>>;
  interviewStatusLists$: Observable<Array<any>>;

  // handling unsubscriptions
  interviewStatusListsSubs: Subscription;

  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig,
    private modalService: NgbModal
  ) {
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.data.loginemployerID = this.employerData.employerID;
    setTimeout(() => {
      this.asyncFunction();
      this.getInterviewStatusLists().then((success: Array<any>) => {
        if (success.length > 0) {
          this.interviewStatusLists = success;
          this.getScheduledNavItems();
          this.getInProcessNavItems();
        }else{
          this.interviewStatusLists = [];
        }
      }).catch((error) => {
        console.error(error);
      });
    });
  }

  public asyncFunction = () => {
    this.getInterviewInProcess();
    this.getInterviewReScheduled();
    this.getInterviewScheduled();
    this.getInterviewUnavailable();
  }
  public getScheduledNavItems = () => {
    this.scheduledNavItems = this.interviewStatusLists.filter((scheduled: any) => {
      return (
        scheduled.interviewstatusID === '5' || scheduled.interviewstatusID === '13' ||
        scheduled.interviewstatusID === '3' || scheduled.interviewstatusID === '11' ||
        scheduled.interviewstatusID === '12' || scheduled.interviewstatusID === '4');
    });
    this.scheduledNavItems = this.scheduledNavItems.sort((
      status1: { interviewstatusID: number; },
      status2: { interviewstatusID: number; }) => {
      return status1.interviewstatusID - status2.interviewstatusID;
    });
  }
  public getInProcessNavItems = () => {
    this.inProcessNavItems = this.interviewStatusLists.filter((inprocess: any) => {
      return (inprocess.interviewstatusID === '13' || inprocess.interviewstatusID === '3');
    });
    this.inProcessNavItems = this.inProcessNavItems.sort((
      status1: { interviewstatusID: number; },
      status2: { interviewstatusID: number; }) => {
      return status1.interviewstatusID - status2.interviewstatusID;
    });
  }
  // filter template data by search input
  public filterScheduled = (searchString: string) => {
    this.searchTexts = searchString;
  }
  public filterinprocess = (searchString: string) => {
    this.searchTextProcess = searchString;
  }
  public filterrescheduled = (searchString: string) => {
    this.searchTextRescheduled = searchString;
  }
  public filterUnavailable = (searchString: string) => {
    this.searchTextUnavailable = searchString;
  }
  // getting template data
  public getInterviewStatusLists = () => {
    return new Promise((resolve, reject) => {
      this.interviewStatusLists$ = this.employerService.getInterviewStatusLists;
      this.interviewStatusListsSubs = this.interviewStatusLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') { resolve(response[0].data); } else { resolve([]); }
        },
        (error) => { reject(error); });
    });
  }
  public getInterviewScheduled = () => {
      this.interviewsScheduled$ = this.employerService.scheduled(this.data);
  }
  public getInterviewInProcess = () => {
      this.interviewsProcess$ = this.employerService.inprocess(this.data);
  }
  public getInterviewReScheduled = () => {
      this.interviewsReScheduled$ = this.employerService.rescheduled(this.data);
  }
  public getInterviewUnavailable = () => {
      this.interviewsUnavailable$ = this.employerService.unavailable(this.data);
  }
  // tracking new value
  public scheduledTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public inProcessTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public reScheduledTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public unAvailableTrackBy = (interview: any) => {
    return interview.interviewID;
  }

  public updateInterviewStatusScheduled = (statusData: any) => {
    if (statusData.interviewstatusID === '3' || statusData.interviewstatusID === '11'){
      this.openRescheduleModal(statusData);
    }else{
      this.spinner.show();
      statusData.loginemployerID = this.employerData.employerID;
      statusData.employerID = '';
      this.employerService.updateInterviewStatusLists(statusData).subscribe(
        (response) => {if (response[0].status === 'true') {
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
  }
  public updateInterviewStatusInProcess = (statusData: any) => {
    if (statusData.interviewstatusID === '3'){
      this.openRescheduleModal(statusData);
    }else{
      this.spinner.show();
      statusData.loginemployerID = this.employerData.employerID;
      statusData.employerID = '';
      this.employerService.updateInterviewStatusLists(statusData).subscribe(
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
  }
  public deleteInterview = (statusData: any) => {
    this.spinner.show();
    statusData.loginemployerID = this.employerData.employerID;
    statusData.employerID = this.employerData.employerID;
    this.employerService.deletingInterview(statusData).subscribe(
      (response) => {if (response[0].status === 'true') {
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
  // accepting and declining re-schedule request
  public acceptRescheduledFromCandidate = (data: any) => {
    this.spinner.show();
    const value = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      interviewID: data.interviewID,
      rescheduleID: data.rescheduledID,
      rescheduleStatusBy: 'Employer',
      employeeID: data.employeeID,
      employerID: this.employerData.employerID,
    };
    this.employerService.acceptInterview(value).subscribe(
      (response) => {if (response[0].status === 'true') {
        this.spinner.hide();
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
  public declineRescheduledFromCandidate = (data: any) => {
    const value = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      interviewID: data.interviewID,
      reasonID: '',
      interviewRejectRemarks: '',
      rescheduleID: data.rescheduledID,
      rescheduleStatusBy: 'employer',
      employeeID: data.employeeID,
      employerID: this.employerData.employerID,
      from: 'rescheduled',
    };
    this.openDeclinedModal(value);
  }
  public rescheduleRescheduledFromCandidate = (data: any) => {
    this.openRescheduleModal(data);
  }
  // decline modal
  public openDeclinedModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open( DeclineModalComponent, this.modalOption);
    modalRef.componentInstance.declineData = data;
    modalRef.result.then(
      (result) => {
        if (result === 'rescheduled') { setTimeout(() => { this.asyncFunction(); }, 1000); }
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
      (result) => { setTimeout(() => {this.asyncFunction(); }, 1000); this.closeResult = `Closed with: ${result}`; },
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

  ngOnDestroy(): void {
    if (this.interviewStatusListsSubs){this.interviewStatusListsSubs.unsubscribe(); }
  }

}
