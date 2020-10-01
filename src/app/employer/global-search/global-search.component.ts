import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { SearchJDdata } from 'src/app/candidateInterface';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationConfig, NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SaveFolderModalComponent } from '../save-folder-modal/save-folder-modal.component';
import { DownloadComponent } from '../download/download.component';
import { ScheduleInterviewModalComponent } from '../schedule-interview-modal/schedule-interview-modal.component';
@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css'],
})
export class GlobalSearchComponent implements OnInit {
  public noRecordFound = false;
  public emptyData = true;
  public loading = false;
  public noRecordFoundWithFilter = false;
  public loadingWithFilter = false;
  public searched = false;
  public pageSize = 10;
  public page = 1;
  public show = 6;
  private employerData: any;
  public data = [];
  public statusShow = [];
  public jobJdID: string;
  public searchJDdata: SearchJDdata = {
    languageID: '1',
    loginemployerID: '',
    skillIDs: '',
    empworkDesignation: '',
    jobjdName: '',
    cityID: '0',
    minval: '1',
    maxval: '500000',
    expMinVal: '0',
    expMaxVal: '5',
    empcertificateName: '',
    noticeID: '',
    emplanguageName: '',
    empkycExpYear: '',
    degreeID: '',
    industryIDs: '',
    noticeIDs: '',
    regionIDs: '',
    countryIDs: '',
    cityIDs: '',
    avialablefromIDs: '',
    emplanguageNames: '',
    degreeIDs: '',
    cvduration: '',
  };
  public differ: any;
  public modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  constructor(
    public employerService: EmployerService,
    private homeService: HomeService,
    private differs: KeyValueDiffers,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig,
    private modalService: NgbModal
  ) {
    // customize default values of paginations used by this component tree
    config.size = 'sm';
    config.boundaryLinks = true;
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
  }

  public changeSkill = ($event: any) => {
    this.getJd($event);
  }
  public changeIndustry = ($event: any) => {
    this.getJd($event);
  }
  public changeCity = ($event: any) => {
    this.getJd($event);
  }
  public changeDegree = ($event: any) => {
    this.getJd($event);
  }
  public changeNotice = ($event: any) => {
    this.getJd($event);
  }
  public changeAvailable = ($event: any) => {
    this.getJd($event);
  }
  public changeCountry = ($event: any) => {
    this.getJd($event);
  }
  public changeCLanguage = ($event: any) => {
    this.getJd($event);
  }
  public changeSallary = ($event: any) => {
    this.getJd($event);
  }
  public changeExperiance = ($event: any) => {
    this.getJd($event);
  }
  public searchOnJobRole = ($event: any) => {
    this.getJd($event);
    const data = {empworkDesignation: $event.empworkDesignation ? $event.empworkDesignation : ''};
    this.employerService.updateFilterData(data);
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
  public searchJd = ($event: any) => {
    this.emptyData = false;
    this.noRecordFoundWithFilter = false;
    this.noRecordFound = false;
    this.searched === true
      ? (this.loadingWithFilter = true)
      : (this.loading = true);
    this.spinner.show();
    this.makeItEmpty();
    const post = JSON.parse($event);
    post.loginemployerID = this.employerData.employerID;
    this.employerService.searchJD(post).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.page = 1;
          this.searched === true
            ? (this.loadingWithFilter = false)
            : (this.loading = false);
          this.searched = true;
          this.data = response[0].data;
          this.spinner.hide();
          this.employerService.updateFilterData(post);
        } else {
          this.page = 1;
          this.spinner.hide();
          this.searched === true
            ? (this.noRecordFoundWithFilter = true)
            : (this.noRecordFound = true);
          this.loadingWithFilter = false;
          this.loading = false;
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  public getJd = (post: any) => {
    this.emptyData = false;
    this.noRecordFound = false;
    this.noRecordFoundWithFilter = false;
    this.loading = false;
    this.loadingWithFilter = true;
    this.spinner.show();
    this.makeItEmpty();
    post.loginemployerID = this.employerData.employerID;
    this.employerService.searchJD(post).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.page = 1;
          this.emptyData = false;
          this.loading = false;
          this.loadingWithFilter = false;
          this.data = response[0].data;
          this.spinner.hide();
        } else {
          this.page = 1;
          this.spinner.hide();
          this.searched = true;
          this.noRecordFound = false;
          this.noRecordFoundWithFilter = true;
          this.loadingWithFilter = false;
          this.loading = false;
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  public scheduleInterviewModal = (employeeData: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ScheduleInterviewModalComponent, this.modalOption);
    modalRef.componentInstance.employeeID = employeeData.employeeID;
    modalRef.result.then(
      (result) => {this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openSaveFolderModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open( SaveFolderModalComponent, this.modalOption);
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
    const modalRef = this.modalService.open( DownloadComponent, this.modalOption);
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
  public makeItEmpty = () => {
    this.data = [];
    this.statusShow = [];
  }
  public makeStatusVisible = (data: any) => {
    this.jobJdID = data.jobjdID ? data.jobjdID : '0';
    const index = this.statusShow.indexOf(data.employeeID);
    if (index === -1) { this.statusShow.push(data.employeeID); } else { this.statusShow.splice(index, 1); }
  }
}
