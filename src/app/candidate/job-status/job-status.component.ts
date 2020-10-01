import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeclineModalComponent } from '../decline-modal/decline-modal.component';
import { Observable } from 'rxjs';
import { Interview } from 'src/app/candidateInterface';

@Component({
  selector: 'app-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.css'],
})
export class JobStatusComponent implements OnInit {
  public employeeData: any;
  public selectedJobs = [];
  public jobDeclinedByCandidate = [];
  public interviewed = [];
  public selected = [];
  public interviewsDeclined = [];
  public interviewStatusLists = [];
  public loading = false;
  public noRecordFound = false;
  public errorOccured = false;
  public closeResult: any;
  modalOption: NgbModalOptions = {}; //  not null!

  interviewsSelected$: Observable<Array<Interview>>;
  interviewsJobDeclined$: Observable<Array<Interview>>;
  interviewsRejected$: Observable<Array<Interview>>;
  interviewsInterviewed$: Observable<Array<Interview>>;

  constructor(
    public candidateService: CandidateService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.getInterviewStatusLists();
    this.asyncFunction();
  }

  public asyncFunction = async () => {
    const selected = await this.getSelectedJobs();
    const interviewed = await this.getInterviewed();
    if (!selected && !interviewed) {
      this.selected = [];
      this.interviewed = [];
      this.loading = false;
      this.noRecordFound = true;
    } else if (interviewed) {
      this.loading = false;
    } else if (selected) {
      this.loading = false;
    } else {
      this.errorOccured = true;
    }
    await this.getJobDeclineByCandidate();
    await this.getRejectedJobs();
  }
  // getting interviews related data
  public getInterviewStatusLists = () => {
    this.candidateService.getInterviewStatusLists().subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.interviewStatusLists = response[0].data;
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  public getSelectedJobs = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '12', // for selected interview data
      };
      this.interviewsSelected$ = this.candidateService.employeeInterviewsSelected(
        data
      );
      this.interviewsSelected$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.selectedJobs = response[0].data[0].selected;
            resolve(this.selectedJobs);
          } else {
            console.error('No Record Found.');
            resolve('No Record Found.');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public getJobDeclineByCandidate = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '9', // for job declined by candidate
      };
      this.interviewsJobDeclined$ = this.candidateService.employeeInterviewsJobDeclined(
        data
      );
      this.interviewsJobDeclined$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.jobDeclinedByCandidate =
              response[0].data[0].jobdeclinedbycandidate;
            resolve(this.jobDeclinedByCandidate);
          } else {
            console.error('No Record Found.');
            resolve('No Record Found.');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public getRejectedJobs = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '7', // for declined by candidate interview data
      };
      this.interviewsRejected$ = this.candidateService.employeeInterviewsRejected(
        data
      );
      this.interviewsRejected$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.interviewsDeclined = response[0].data[0].rejected;
            resolve(this.interviewsDeclined);
          } else {
            console.error('No Record Found.');
            resolve('No Record Found.');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public getInterviewed = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: '0',
        employeeID: this.employeeData.employeeID,
        type: 'Employee',
        jobjdID: '',
        interviewstatusID: '5', // for Re-Scheduled interview data
      };
      this.interviewsInterviewed$ = this.candidateService.employeeInterviewsInterviewed(
        data
      );
      this.interviewsInterviewed$.subscribe(
        (response) => {
          if (response[0].data[0].Interviewed.length > 0) {
            this.interviewed = response[0].data[0].Interviewed;
            this.interviewed.sort((a, b) => {
              return a.interviewID - b.interviewID;
            });
            this.interviewed.reverse();
            resolve(this.interviewed);
          } else {
            console.error('No Record Found.');
            resolve('No Record Found.');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  // track by
  public interviewedTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }
  public selectedTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }
  // accept and decline selected job
  public onAcceptSelectedJob = (interviewID: any) => {
    this.spinner.show();
    const saveInterview = this.selectedJobs.filter(
      (interview) => interview.interviewID === interviewID
    );
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
          this.spinner.hide();
          setTimeout(() => {
            this.getSelectedJobs();
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
  public onDeclineSelectedJob = (interviewID: any) => {
    const saveInterview = this.selected.filter(
      (interview) => interview.interviewID === interviewID
    );
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
      from: 'selected',
    };
    this.openDeclinedModal(data);
  }
  // open decline modal
  public openDeclinedModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      DeclineModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.declineData = data;
    modalRef.result.then(
      (result) => {
        if (result === 'selected') {
          setTimeout(() => {
            this.getSelectedJobs();
          }, 1000);
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
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
}
