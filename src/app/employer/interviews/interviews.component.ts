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
  public inProcess: any = [];
  public scheduled: any = [];
  public unavailable: any = [];
  public reScheduled: any = [];
  public interviewStatusLists: any = [];
  public scheduledNavItems: any = [];
  public inProcessNavItems: any = [];
  public reScheduledNavItems: any = [];
  public loadingScheduled = false;
  public loadingInProcess = false;
  public loadingUnAvailable = false;
  public loadingReScheduled = false;
  public noRecordFoundScheduled = false;
  public noRecordFoundInProcess = false;
  public noRecordFoundUnAvailable = false;
  public noRecordFoundReScheduled = false;
  public errorOccuredScheduled = false;
  public errorOccuredInProcess = false;
  public errorOccuredUnAvailable = false;
  public errorOccuredReScheduled = false;
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

  interviewsProcess$: Observable<Array<Interview>>;
  interviewsScheduled$: Observable<Array<Interview>>;
  interviewsReScheduled$: Observable<Array<Interview>>;
  interviewsUnavailable$: Observable<Array<Interview>>;
  interviewStatusLists$: Observable<Array<any>>;

  // handling unsubscriptions
  interviewsProcessSubs: Subscription;
  interviewsScheduledSubs: Subscription;
  interviewsReScheduledSubs: Subscription;
  interviewsUnavailableSubs: Subscription;
  interviewStatusListsSubs: Subscription;

  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    config: NgbPaginationConfig,
    private modalService: NgbModal
  ) {
    // customize default values of paginations used by this component tree
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.loadingScheduled = true;
    this.loadingInProcess = true;
    this.loadingReScheduled = true;
    this.loadingUnAvailable = true;
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
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

  public asyncFunction = async () => {
    await this.getInterviewScheduled()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.scheduled = fulfilled;
          this.loadingScheduled = false;
          this.scheduled.forEach((element: any) => {
            element.employeeName = element.employee[0].employeeName;
          });
        } else {
          this.scheduled = [];
          this.loadingScheduled = false;
          this.noRecordFoundScheduled = true;
        }
      })
      .catch(() => {
        this.loadingScheduled = false;
        this.noRecordFoundScheduled = false;
        this.errorOccuredScheduled = true;
      });
    await this.getInterviewInProcess()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.inProcess = fulfilled;
          this.loadingInProcess = false;
          this.inProcess.forEach((element: any) => {
            element.employeeName = element.employee[0].employeeName;
          });
        } else {
          this.inProcess = [];
          this.loadingInProcess = false;
          this.noRecordFoundInProcess = true;
        }
      })
      .catch(() => {
        this.loadingInProcess = false;
        this.noRecordFoundInProcess = false;
        this.errorOccuredInProcess = true;
      });
    await this.getInterviewReScheduled()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.reScheduled = fulfilled;
          this.loadingReScheduled = false;
          this.reScheduled.forEach((element: any) => {
            element.employeeName = element.employee[0].employeeName;
          });
        } else {
          this.reScheduled = [];
          this.loadingReScheduled = false;
          this.noRecordFoundReScheduled = true;
        }
      })
      .catch(() => {
        this.loadingReScheduled = false;
        this.noRecordFoundReScheduled = false;
        this.errorOccuredReScheduled = true;
      });
    await this.getInterviewUnavailable()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.unavailable = fulfilled;
          this.loadingUnAvailable = false;
          this.unavailable.forEach((element: any) => {
            element.employeeName = element.employee[0].employeeName;
          });
        } else {
          this.unavailable = [];
          this.loadingUnAvailable = false;
          this.noRecordFoundUnAvailable = true;
        }
      })
      .catch(() => {
        this.loadingUnAvailable = false;
        this.noRecordFoundUnAvailable = false;
        this.errorOccuredUnAvailable = true;
      });
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
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employeeID: '',
        type: 'Employer',
        jobjdID: '',
        interviewstatusID: '1', // for scheduled interview data
      };
      this.pageSchedule = 1;
      this.interviewsScheduled$ = this.employerService.interviewsScheduled(data);
      this.interviewsScheduledSubs = this.interviewsScheduled$.subscribe(
        (response) => {
          if (response[0].data[0].scheduled.length > 0) {
            resolve(response[0].data[0].scheduled);
          } else { resolve([]); }
        },
        (error) => { reject(error); }
      );
    });
  }
  public getInterviewInProcess = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employeeID: '',
        type: 'Employer',
        jobjdID: '',
        interviewstatusID: '14', // for un-available interview data
      };
      this.pageProgress = 1;
      this.interviewsProcess$ = this.employerService.interviewsProcess(data);
      this.interviewsProcessSubs = this.interviewsProcess$.subscribe(
        (response) => {
          if (response[0].data[0].inprogress.length > 0) {
            resolve(response[0].data[0].inprogress);
          } else { resolve([]); }
        },
        (error) => { reject(error); }
      );
    });
  }
  public getInterviewReScheduled = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employeeID: '',
        type: 'Employer',
        jobjdID: '',
        interviewstatusID: '3', // for Re-Scheduled interview data
      };
      this.pageReschedule = 1;
      this.interviewsReScheduled$ = this.employerService.interviewsRescheduled(data);
      this.interviewsReScheduledSubs = this.interviewsReScheduled$.subscribe(
        (response) => {
          if (response[0].data[0].reschedule !== null) {
            if (response[0].data[0].reschedule.length > 0) {
              resolve(response[0].data[0].reschedule);
            } else {resolve([]); }
          } else {resolve([]); }
        },
        (error) => { reject(error); }
      );
    });
  }
  public getInterviewUnavailable = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        employeeID: '',
        type: 'Employer',
        jobjdID: '',
        interviewstatusID: '4', // for un-available interview data
      };
      this.pageUnavailable = 1;
      this.interviewsUnavailable$ = this.employerService.interviewsUnavailabe(data);
      this.interviewsUnavailableSubs = this.interviewsUnavailable$.subscribe(
        (response) => {
          if (response[0].data[0].unavailable.length > 0) {
            resolve(response[0].data[0].unavailable);
          } else {resolve([]); }
        },
        (error) => {reject(error); }
      );
    });
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
  // updating status
  public updateStatus = () => {
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
    const saveInterview = this.reScheduled.filter(
      (interview: any) => interview.interviewID === data.interviewID
    );
    const value = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      interviewID: saveInterview[0].interviewID,
      rescheduleID: data.rescheduledID,
      rescheduleStatusBy: 'Employer',
      employeeID: saveInterview[0].employeeID,
      employerID: saveInterview[0].employerID,
    };
    this.employerService.acceptInterview(value).subscribe(
      (response) => {if (response[0].status === 'true') {
          this.spinner.hide();
          setTimeout(() => { this.asyncFunction(); }, 1000);
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
    const saveInterview = this.reScheduled.filter(
      (interview: any) => interview.interviewID === data.interviewID
    );
    const value = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      interviewID: saveInterview[0].interviewID,
      reasonID: '',
      interviewRejectRemarks: '',
      rescheduleID: data.rescheduledID,
      rescheduleStatusBy: 'employer',
      employeeID: saveInterview[0].employeeID,
      employerID: saveInterview[0].employerID,
      from: 'rescheduled',
    };
    this.openDeclinedModal(value);
  }
  public rescheduleRescheduledFromCandidate = (data: any) => {
    const saveInterview = this.reScheduled.filter(
      (interview: any) => interview.interviewID === data.interviewID
    );
    this.openRescheduleModal(saveInterview[0]);
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
    if (this.interviewsProcessSubs){this.interviewsProcessSubs.unsubscribe(); }
    if (this.interviewsScheduledSubs){this.interviewsScheduledSubs.unsubscribe(); }
    if (this.interviewsReScheduledSubs){this.interviewsReScheduledSubs.unsubscribe(); }
    if (this.interviewsUnavailableSubs){this.interviewsUnavailableSubs.unsubscribe(); }
    if (this.interviewStatusListsSubs){this.interviewStatusListsSubs.unsubscribe(); }
  }

}
