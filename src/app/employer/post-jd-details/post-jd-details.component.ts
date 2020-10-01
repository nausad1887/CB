import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalOptions, NgbPaginationConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { SaveFolderModalComponent } from '../save-folder-modal/save-folder-modal.component';
import { DownloadComponent } from '../download/download.component';
import { ScheduleInterviewModalComponent } from '../schedule-interview-modal/schedule-interview-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReScheduleModalComponent } from '../re-schedule-modal/re-schedule-modal.component';

@Component({
  selector: 'app-post-jd-details',
  templateUrl: './post-jd-details.component.html',
  styleUrls: ['./post-jd-details.component.css'],
})
export class PostJdDetailsComponent implements OnInit, OnDestroy {
  public closeResult: string;
  public url: string;
  public searchText: string;
  public jobJdID: string;
  public interviewsStatusID: string;
  // array
  public allNavItems: Array<any>;
  public statusShow = [];
  public employerData: any;
  public interviewStatusLists = [];
  // pagination data
  public pageSize = 4;
  public page = 1;
  // navbar
  modalOption: NgbModalOptions = {}; // not null!
  interviewStatusLists$: Observable<Array<any>>;
  subscriptionStatus: Subscription;
  getListsFavourites$: Observable<Array<any>>;
  getListsInterviewed$: Observable<Array<any>>;
  getListsSelected$: Observable<Array<any>>;
  getListsOnboarding$: Observable<Array<any>>;
  getListsRejected$: Observable<Array<any>>;
  getListsInterviewDeclined$: Observable<Array<any>>;
  getListsJobDeclined$: Observable<Array<any>>;
  // search data
  public data = {
    languageID: '1',
    loginemployerID: '',
    employeeID: '',
    type: 'Employer',
    jobjdID: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdID,
    jobjdName: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdName ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdName : '',
    jobjdStatus: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdStatus,
    interviewstatusID: '0',
    employerfavoriteIDcount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdFavoriteCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdFavoriteCount : '0',
    jobjdViewCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdViewCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdViewCount : '0',
    jobjdInterviewCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdInterviewCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdInterviewCount : '0',
    jobjdSelectedCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdSelectedCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdSelectedCount : '0',
    jobjdOnboardedCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdOnboardedCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdOnboardedCount : '0',
    jobjdRejectedCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdRejectedCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdRejectedCount : '0',
    jobjdInterviewDeclinedCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdInterviewDeclinedCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdInterviewDeclinedCount : '0',
    jobjdDeclinedCount: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdDeclinedCount ?
      JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdDeclinedCount : '0',
  };
  public listData = {
    languageID: '1',
    loginemployerID: '',
    employeeID: '',
    searchWord: '',
    type: 'Employer',
    jobjdID: JSON.parse(sessionStorage.getItem('jobjdINFO')).jobjdID,
    employerfavoriteID: JSON.parse(sessionStorage.getItem('jobjdINFO')).employerfavoriteID
  };
  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
  ) {
    // customize default values of paginations used by this component tree
    config.size = 'sm';
    config.boundaryLinks = true;
  }
  ngOnInit(): void {
    this.spinner.show();
    this.interviewsStatusID = 'favourites';
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    setTimeout(() => {
      this.getFavourites('Favourites');
      this.getInterviewStatusLists();
    });
    this.listData.loginemployerID = this.employerData.employerID;
  }
  public getInterviewStatusLists = () => {
    this.interviewStatusLists$ = this.employerService.getInterviewStatusLists;
    this.subscriptionStatus = this.interviewStatusLists$.subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.interviewStatusLists = response[0].data;
          this.allNavItems = this.interviewStatusLists.filter(
            (statusIDs$: any) => {
              return (statusIDs$.interviewstatusID === '11' || statusIDs$.interviewstatusID === '12' || statusIDs$.interviewstatusID === '13');
            }
          );
          this.allNavItems.sort((status1: any, status2: any) => status1.interviewstatusID - status2.interviewstatusID);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  public updateStatus = (statusData: any) => {
    this.spinner.show();
    statusData.loginemployerID = this.employerData.employerID;
    statusData.employerID = '';
    this.employerService.updateInterviewStatusLists(statusData).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          setTimeout(() => {
            this.spinner.hide();
            this.getFavourites('Favourites');
          }, 500);
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
  public filterCandidateByName = (employeeName: string) => {
    this.searchText = employeeName;
  }
  public onClickAll = () => {
    if (this.interviewsStatusID !== 'favourites') {
      this.spinner.show();
      this.url = 'Favourites';
      this.statusShow = [];
      setTimeout(() => {
        this.interviewsStatusID = 'favourites';
        this.spinner.hide();
      }, 1500);
    }
  }
  public scheduleNextRound = (data: any) => {
    this.openRescheduleModal(data, data.jobjdID);
  }
  public onClickSave = (data: any) => {
    this.openSaveFolderModal(data);
  }
  public onClickDownload = (data: any) => {
    this.openDownloadFolderModal(data);
  }
  public onClickScheduleInterview = (data: any) => {
    this.scheduleInterviewModal(data);
  }
  public scheduleInterviewModal = (employeeData: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ScheduleInterviewModalComponent, this.modalOption);
    modalRef.componentInstance.employeeID = employeeData.employeeID;
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openRescheduleModal = (data: any, jobjdID?: string) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ReScheduleModalComponent, this.modalOption);
    modalRef.componentInstance.rescheduleData = data;
    modalRef.componentInstance.jobjdID = jobjdID ? jobjdID : '';
    modalRef.result.then(
      (result) =>
      { result === 'RequestSent' ? this.getInterviewed('Interviewed') : this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openSaveFolderModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(SaveFolderModalComponent, this.modalOption);
    data.employerID = this.employerData.employerID;
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openDownloadFolderModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(DownloadComponent, this.modalOption);
    data.employerID = this.employerData.employerID;
    modalRef.componentInstance.data = data;
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
  public makeStatusVisible = (data: any) => {
    this.jobJdID = data.jobjdID ? data.jobjdID : '0';
    const index = this.statusShow.indexOf(data.employeeID);
    if (index === -1) {
      this.statusShow.push(data.employeeID);
    } else {
      this.statusShow.splice(index, 1);
    }
  }
  public onClickRemoveFromFavourite = (removedata: any) => {
    const data = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      employerfavoriteID: removedata.employerfavoriteID,
      employeeID: removedata.employeeID
    };
    this.removeFavourite(data).then((ifTrue: boolean) => {
      if (ifTrue) {this.getFavourites(this.url); this.spinner.hide(); }
    }).catch(() => {
      this.spinner.hide();
      this.openSnackBar('error occured', 'error');
    });
  }

  public getFavourites = (url: string) => {
    this.interviewsStatusID = 'favourites';
    this.url = url;
    this.getListsFavourites$ = this.employerService.employerViewFavourites(this.listData);
  }
  public getInterviewed = (url: string) => {
    this.interviewsStatusID = '5';
    this.url = url;
    this.getListsInterviewed$ = this.employerService.interviewed(this.listData);
  }
  public getSelected = (url: string) => {
    this.interviewsStatusID = '6';
    this.url = url;
    this.getListsSelected$ = this.employerService.selected(this.listData);
  }
  public getOnboarded = (url: string) => {
    this.interviewsStatusID = '12';
    this.url = url;
    this.getListsOnboarding$ = this.employerService.selectedONboarding(this.listData);
  }
  public getRejected = (url: string) => {
    this.interviewsStatusID = '7';
    this.url = url;
    this.getListsRejected$ = this.employerService.rejected(this.listData);
  }
  public getInterviewDeclined = (url: string) => {
    this.interviewsStatusID = '8';
    this.url = url;
    this.getListsInterviewDeclined$ = this.employerService.interviewDeclined(this.listData);
  }
  public getJOBdeclined = (url: string) => {
    this.interviewsStatusID = '9';
    this.url = url;
    this.getListsJobDeclined$ = this.employerService.jobDeclined(this.listData);
  }
  public removeFavourite = (data: any) => {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.employerService.removeFromFavourites(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(true);
          } else { reject(false); }
        }, error => { reject(error); });
    });
  }
  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
  // tracking new value
  public allListsTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public interviewedTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public rejectedTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public selectedTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public interviewDeclinedTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public jobDeclinedTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  public selectedOnboardingTrackBy = (interview: any) => {
    return interview.interviewID;
  }
  ngOnDestroy(): void {
    if (this.subscriptionStatus){this.subscriptionStatus.unsubscribe(); }
  }
}
