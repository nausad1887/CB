import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SaveFolderModalComponent } from '../save-folder-modal/save-folder-modal.component';
import { HomeService } from 'src/app/home.service';
import { ScheduleInterviewModalComponent } from '../schedule-interview-modal/schedule-interview-modal.component';

@Component({
  selector: 'app-candidate-profile-view',
  templateUrl: './candidate-profile-view.component.html',
  styleUrls: ['./candidate-profile-view.component.css']
})
export class CandidateProfileViewComponent implements OnInit {
  public closeResult: string;
  public employeeData =
    history.state.data.employeeData ? history.state.data.employeeData : '';
  public employerData: any;
  public primarySkills = [];
  public secondarySkills = [];
  public othersSkills = [];
  public resumeUrl: string;
  public url: string;
  public resumeUpdatedDate: Date;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  modalOption: NgbModalOptions = {}; // not null!
  public employeeDataForDisplay = {
    employeeFullName: `${this.employeeData.kycinfo[0].employeeFirstname} ${this.employeeData.kycinfo[0].employeeLastname}`,
    employeeFullAddress: `${this.employeeData.cityName}, ${this.employeeData.stateName}, ${this.employeeData.countryName}`,
    employeeMobile: this.employeeData.employeeMobile,
    employeeDOB: this.employeeData.employeeDOB,
    employeeMartialStatus: this.employeeData.employeeMartialStatus,
    employeeGender: this.employeeData.employeeGender,
    employeeCurrentAddress: this.employeeData.employeeCurrentAddress,
    employeePermanantAddress: this.employeeData.employeePermanantAddress,
    empkycInterviewFrom: this.tConvert(
      this.employeeData.kycinfo[0].empkycInterviewFrom
    ),
    empkycInterviewTo: this.tConvert(
      this.employeeData.kycinfo[0].empkycInterviewTo
    ),
    empkycExpYear: this.employeeData.kycinfo[0].empkycExpYear,
    empkycExpMonth: this.employeeData.kycinfo[0].empkycExpMonth,
    employeeEmail: this.employeeData.employeeEmail,
    resume: this.employeeData.employeeResume,
    resumeUpdatedDate: this.employeeData.employeeResumeUpdated,
    resumeUrl: `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeResume}`,
    empProfile: `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`,
    skills: this.employeeData.employeeskill.length > 0 ? this.employeeData.employeeskill : [],
    primarySkills: [],
    secondarySkills: [],
    othersSkills: [],
    certificates: this.employeeData.certificates.length > 0 ? this.employeeData.certificates : [],
    // awards: this.employeeData.awards.length > 0 ? this.employeeData.awards : [],
    employeeeducation: this.employeeData.employeeeducation.length > 0 ? this.employeeData.employeeeducation : [],
    employeework: this.employeeData.employeework.length > 0 ? this.employeeData.employeework : [],
    kycinfo: this.employeeData.kycinfo.length > 0 ? this.employeeData.kycinfo : [],
    languages: this.employeeData.languages.length > 0 ? this.employeeData.languages : [],
    workprofiles: this.employeeData.workprofiles.length > 0 ? this.employeeData.workprofiles : [],
    workProfile: this.employeeData.workprofiles.length > 0
      ? this.employeeData.workprofiles[0]
      : ''
  };
  // @ViewChild('award') public award: ElementRef;
  @ViewChild('AttachResume') public AttachResume: ElementRef;
  @ViewChild('summary') public summary: ElementRef;
  @ViewChild('skills') public skills: ElementRef;
  @ViewChild('education') public education: ElementRef;
  @ViewChild('employment') public employment: ElementRef;
  @ViewChild('certificate') public certificate: ElementRef;
  @ViewChild('profile') public profile: ElementRef;
  @ViewChild('pdetails') public pdetails: ElementRef;
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.employeeDataForDisplay.primarySkills = this.pSkills;
    this.employeeDataForDisplay.secondarySkills = this.sSkills;
    this.employeeDataForDisplay.othersSkills = this.oSkills;
  }

  // public moveToAward(): void {
  //   this.award.nativeElement.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center',
  //   });
  // }
  public moveToResume(): void {
    this.AttachResume.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToResumeSummary(): void {
    this.summary.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToSkills(): void {
    this.skills.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToEducation(): void {
    this.education.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToEmployment(): void {
    this.employment.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToCertificate(): void {
    this.certificate.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToProfile(): void {
    this.profile.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToPersonalDetails(): void {
    this.pdetails.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  public resumeOpenInNewTap = (url: string, fileName: string) => {
    window.open(url, fileName);
  }

  get pSkills() {
    return this.employeeDataForDisplay.skills.filter((skill: { empskillType: string; }) => skill.empskillType === 'Primary');
  }
  get sSkills() {
    return this.employeeDataForDisplay.skills.filter((skill: { empskillType: string; }) => skill.empskillType === 'Secondary');
  }
  get oSkills() {
    return this.employeeDataForDisplay.skills.filter((skill: { empskillType: string; }) => skill.empskillType === 'Other');
  }

  public scheduleInterviewModal = (employeeData: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ScheduleInterviewModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeID = employeeData.employeeID;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  public openSaveFolderModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      SaveFolderModalComponent,
      this.modalOption
    );
    const data = {
      employerID: this.employerData.employerID,
      employeeID: this.employeeData.employeeID,
      jobjdID: history.state.data.jobjdID ? history.state.data.jobjdID : '0'
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      (result) => {
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
}
