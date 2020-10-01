import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { WorkprofileModalComponent } from '../workprofile-modal/workprofile-modal.component';

@Component({
  selector: 'app-shared-profile',
  templateUrl: './shared-profile.component.html',
  styleUrls: ['./shared-profile.component.css'],
})
export class SharedProfileComponent implements OnInit, DoCheck {
  public visible: boolean;
  public employeeName: string;
  public closeResult: string;
  public differ: any;
  public change: any;
  public workProfile: any;
  public employeeData: any;
  public profileProfress = [];
  public employeeDataForDisplay = {
    employeeProfileProgress: '',
  };
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    private differs: KeyValueDiffers,
    private modalService: NgbModal
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.checkStatus();
    this.checkVisibleOrNot();
    this.getUpdateFromComponents();
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.workProfile =
      this.employeeData.workprofiles.length > 0
        ? this.employeeData.workprofiles[0]
        : '';
    this.employeeName = this.employeeData.employeeName;
    this.employeeDataForDisplay.employeeProfileProgress = this.employeeData.employeeProfileProgress;
    this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
    this.employeeName = this.employeeData.employeeName;
    this.employeeDataForDisplay.employeeProfileProgress = this.employeeData.employeeProfileProgress;
    this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
  }

  public checkVisibleOrNot = () => {
    const d1 = new Date();
    const d2 = new Date(this.employeeData.employeeProfileVisibleFrom);
    this.visible = d1.getTime() >= d2.getTime();
  }

  public makeVisible = () => {
    const date =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      languageID: '1',
      employeeServiceNotice: 'Yes',
      employeeProfileVisibleFrom: date,
    };
    this.candidateService.employeeProfileVisibleFrom(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.homeService.getCurrentUserFromLocalStorage()
            ? this.homeService.setCurrentUserInLocalStorage(response[0].data[0])
            : this.homeService.setCurrentUserInSessionStorage(response[0].data[0]);
          setTimeout(() => {
            this.ngOnInit();
          }, 500);
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public openEditWorkProfile = (workprofileData: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      WorkprofileModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.checkStatus();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.addWorkProfile = false;
    modalRef.componentInstance.editWorkProfile = true;
    modalRef.componentInstance.editableData = workprofileData;
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

  public getUpdateFromComponents = () => {
    this.candidateService.updateAllComponenet.subscribe(
      (response) => (this.change = response ? response : '')
    );
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'change') {
          this.checkStatus();
        }
      });
    }
  }
}
