import { Component, OnInit, KeyValueDiffers, DoCheck } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import {NgbModalOptions,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { BasicUpdateModalComponent } from '../basic-update-modal/basic-update-modal.component';
import { CandidateService } from '../candidate.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileData } from 'src/app/candidateInterface';
import { WorkprofileModalComponent } from '../workprofile-modal/workprofile-modal.component';

@Component({
  selector: 'app-shared-basic-details',
  templateUrl: './shared-basic-details.component.html',
  styleUrls: ['./shared-basic-details.component.css'],
})
export class SharedBasicDetailsComponent implements OnInit, DoCheck {
  public employeeDataForDisplay = {
    employeeFullName: '',
    employeeFullAddress: '',
    employeeMobile: '',
    empkycProofaddNumber: '',
    empkycProofidNumber: '',
    empkycInterviewFrom: '',
    empkycInterviewTo: '',
    empkycExpYear: '',
    empkycExpMonth: '',
    employeeEmail: '',
    employeeProfileProgress: '',
    empkycCTCPACurrency: '',
    empkycCTCPA: '',
  };
  public employeeData: any;
  public workProfile: any;
  public resume: string;
  public resumeUrl: string;
  public url: string;
  public visible: boolean;
  public closeResult: string;
  public differ: any;
  public change: any;
  public resumeUpdatedDate: Date;
  public maxSize = 2048000;
  public selectedFiles: File;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    public homeService: HomeService,
    private modalService: NgbModal,
    public candidateService: CandidateService,
    public toastr: ToastrManager,
    private snackBar: MatSnackBar,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.getUpdateFromComponents();
    this.getStatus();
    this.checkVisibleOrNot();
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
          this.getStatus();
        }
      });
    }
  }

  public getStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.workProfile =
      this.employeeData.workprofiles.length > 0
        ? this.employeeData.workprofiles[0]
        : '';
    this.getKycInfo();
  }

  public getKycInfo = () => {
    if (this.employeeData.kycinfo.length > 0) {
      this.employeeDataForDisplay.employeeFullName = `${this.employeeData.kycinfo[0].employeeFirstname} ${this.employeeData.kycinfo[0].employeeLastname}`;
      this.employeeDataForDisplay.employeeMobile = this.employeeData.employeeMobile;
      this.employeeDataForDisplay.employeeFullAddress = `${this.employeeData.cityName}, ${this.employeeData.stateName}, ${this.employeeData.countryName}`;
      this.employeeDataForDisplay.empkycProofaddNumber = this.employeeData.kycinfo[0].empkycProofaddNumber;
      this.employeeDataForDisplay.empkycProofidNumber = this.employeeData.kycinfo[0].empkycProofidNumber;
      this.employeeDataForDisplay.employeeEmail = this.employeeData.employeeEmail;
      this.employeeDataForDisplay.empkycExpYear = this.employeeData.kycinfo[0].empkycExpYear;
      this.employeeDataForDisplay.empkycExpMonth = this.employeeData.kycinfo[0].empkycExpMonth;
      this.employeeDataForDisplay.empkycInterviewFrom = this.tConvert(
        this.employeeData.kycinfo[0].empkycInterviewFrom
      );
      this.employeeDataForDisplay.empkycInterviewTo = this.tConvert(
        this.employeeData.kycinfo[0].empkycInterviewTo
      );
      this.employeeDataForDisplay.employeeProfileProgress = this.employeeData.employeeProfileProgress;
      this.employeeDataForDisplay.empkycCTCPACurrency = this.employeeData.kycinfo[0].empkycCTCPACurrency;
      this.employeeDataForDisplay.empkycCTCPA = this.employeeData.kycinfo[0].empkycCTCPA;
      this.resume = this.employeeData.employeeResume;
      this.resumeUpdatedDate = this.employeeData.employeeResumeUpdated;
      this.resumeUrl = `${this.baseUrl}/${this.employeeData.employeeID}/${this.resume}`;
      this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
    } else {
      this.employeeDataForDisplay.employeeEmail = this.employeeData.employeeEmail;
      this.employeeDataForDisplay.employeeMobile = this.employeeData.employeeMobile;
      this.employeeDataForDisplay.employeeFullName = this.employeeData.employeeName;
      this.employeeDataForDisplay.employeeProfileProgress = this.employeeData.employeeProfileProgress;
      this.resume = this.employeeData.employeeResume;
      this.resumeUpdatedDate = this.employeeData.employeeResumeUpdated;
      this.resumeUrl = `${this.baseUrl}/${this.employeeData.employeeID}/${this.resume}`;
      this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
    }
  }

  public openDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(
      BasicUpdateModalComponent,
      this.modalOption
    );
    const data = {
      countryID: this.employeeData.countryID
        ? this.employeeData.countryID
        : '',
      stateID: this.employeeData.stateID ? this.employeeData.stateID : '',
      cityID: this.employeeData.cityID ? this.employeeData.cityID : '',
      employeeFirstname:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].employeeFirstname
          : '',
      employeeLastname:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].employeeLastname
          : '',
      empkycExpYear:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycExpYear
          : '',
      empkycExpMonth:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycExpMonth
          : '',
      empkycRelExpYear:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycRelExpYear
          : '',
      empkycRelExpMonth:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycRelExpMonth
          : '',
      noticeID:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].noticeID
          : '',
      avialablefromID:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].avialablefromID
          : '',
      proofidID:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].proofidID
          : '',
      proofaddID:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].proofaddID
          : '',
      empkycProofidNumber:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycProofidNumber
          : '',
      empkycProofaddNumber:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycProofaddNumber
          : '',
      empkycWorkPermitCountryID:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycWorkPermitCountryID
          : '',
      empkycWorkPermittTill:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].empkycWorkPermittTill
          : '',
      employeeEmail: this.employeeData.employeeEmail
        ? this.employeeData.employeeEmail
        : '',
      employeeMobile: this.employeeData.employeeMobile
        ? this.employeeData.employeeMobile
        : '',
      employeeID: this.employeeData.employeeID,
      proofidName:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].proofidName
          : '',
      proofaddName:
        this.employeeData.kycinfo.length > 0
          ? this.employeeData.kycinfo[0].proofaddName
          : '',
    };
    modalRef.componentInstance.kycinfo = data;
    modalRef.result.then(
      (result) => {
        this.getStatus();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public checkVisibleOrNot = () => {
    const d1 = new Date();
    const d2 = new Date(this.employeeData.employeeProfileVisibleFrom);
    this.visible = d1.getTime() >= d2.getTime();
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

  public async onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size <= this.maxSize) {
        this.selectedFiles = event.target.files[0] as File;
        await this.uploadFiles(this.selectedFiles)
          .then((fulfilled) => {
            this.employeeUpdateProfilePicture(fulfilled[0].fileName);
          })
          .catch((errored) => {
            console.error(errored);
          });
      } else {
        this.openSnackBar('File size Should not be more than 2 MB', 'false');
      }
    }
  }

  public employeeUpdateProfilePicture(employeeProfilePicture: string) {
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      employeeProfilePicture,
    };
    this.candidateService.employeeUpdateProfilePicture(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${response[0].data[0].employeeProfilePicture}`;
          this.openSnackBar('Profile Picture Updated', 'success');
          this.updateData(response[0].data);
          setTimeout(() => {
            this.candidateService.updateCurrentCandidate(response[0].data);
          }, 500);
        } else {
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (errored) => {
        console.error(errored);
      }
    );
  }

  public uploadFiles = (file: File) => {
    return new Promise((resolve, reject) => {
      const data: UploadFileData = {
        file,
        fileName: file.name,
        filePath: this.employeeData.employeeID,
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.uploadFile(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response);
          } else {
            reject(response);
            this.openSnackBar(response[0].message, 'error');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.getStatus();
    }, 500);
  }

  public tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    time[0] < 10 ? (time[0] = '0' + time[0]) : (time[0] = time[0]);
    return time[0] + '' + time[1] + '' + time[2] + ' ' + time[5]; // return adjusted time or original string
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
        this.getStatus();
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
            this.getStatus();
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
}
