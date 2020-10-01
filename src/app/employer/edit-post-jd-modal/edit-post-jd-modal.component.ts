import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from 'src/app/home.service';
import { EmployerService } from '../employer.service';
import { UploadFileDataEmployer, City, Notice, Skill } from 'src/app/candidateInterface';

@Component({
  selector: 'app-edit-post-jd-modal',
  templateUrl: './edit-post-jd-modal.component.html',
  styleUrls: ['./edit-post-jd-modal.component.css'],
})
export class EditPostJdModalComponent implements OnInit {
  @Input() jobJD: any;
  editPostJDform: FormGroup;
  cityLists$: Observable<Array<City>>;
  noticeLists$: Observable<Array<Notice>>;
  sallaryRange$: Observable<Array<any>>;
  degreeLists$: Observable<Array<any>>;
  public makeItFalse = true;
  public jobjdFile: any;
  public jobjdFileUrl: any;
  public selectedFiles: File[] = [];
  public fileToUpload = [];
  public postImageName = [];
  public employerData: any;
  public jdUrl = 'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public postJDjobType = [
    'Full Time',
    'Half Days',
    'Work from Home',
    '2 Hrs only',
  ];
  public expYears = [
    { id: '0.00', value: 'Fresher' },
    { id: '1.00', value: '1 Years' },
    { id: '2.00', value: '2 Years' },
    { id: '3.00', value: '3 Years' },
    { id: '4.00', value: '4 Years' },
    { id: '5.00', value: '5 Years & Above' },
  ];
  skillslist$: Observable<Array<Skill>>;
  constructor(
    public activeModal: NgbActiveModal,
    public candidateService: CandidateService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public homeService: HomeService,
    public employerService: EmployerService,
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.editPostJDform = this.fb.group({
      jobjdName: [this.jobJD.jobjdName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      cityID: [this.jobJD.cityID ? this.jobJD.cityID : null, Validators.compose([Validators.required])],
      salaryrangeID: [this.jobJD.salaryrangeID, Validators.compose([Validators.required])],
      jobjdexperiance: [this.jobJD.jobjdexperiance, Validators.compose([Validators.required])],
      skills: [this.jobJD.jdskills.length > 0 ? this.jobJD.jdskills : [], Validators.compose([Validators.required])],
      noticeID: [this.jobJD.noticeID, Validators.compose([Validators.required])],
      degreeID: [this.jobJD.degreeID, Validators.compose([Validators.required])],
      jobjdOpenings: [this.jobJD.jobjdOpenings, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      jobjdJobType: [this.jobJD.jobjdJobType, Validators.compose([Validators.required])],
      jobjdCertificatation: [this.jobJD.jobjdCertificatation, Validators.compose([Validators.required])],
      jobjdDescription: [this.jobJD.jobjdDescription, Validators.compose([Validators.required])],
    });
    // current employer
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.skillslist$ = this.candidateService.skills;
    this.cityLists$ = this.candidateService.cities;
    this.sallaryRange$ = this.candidateService.sallary;
    this.noticeLists$ = this.candidateService.notices;
    this.degreeLists$ = this.candidateService.degree;
  }

  onClose() {
    this.activeModal.close();
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public onSelectFile(event: any) {
    setTimeout(() => {this.prewiewImage(event); }, 300);
    this.selectedFiles.push(event.target.files[0] as File);
    this.postImageName.push(this.selectedFiles[0].name);
    this.jobjdFile = event.target.files[0].name;
  }

  public prewiewImage = (event: any) => {
    const reader = new FileReader();
    setTimeout(() => {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.makeItFalse = false;
        this.jobjdFileUrl = reader.result;
      };
    }, 100);
  }

  // uploading files when post success
  public uploadFiles = () => {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.fileToUpload.push(this.selectedFiles[i]);
      const data: UploadFileDataEmployer = {
        file: this.fileToUpload[i],
        fileName: this.postImageName[i],
        filePath: this.employerData.loginemployerID,
        loginemployerID: this.employerData.loginemployerID,
      };
      this.employerService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
        } else {
        }
      });
    }
  }

  public onEditPostJDsubmit = (post: any) => {
    this.markFormTouched(this.editPostJDform);
    if (this.editPostJDform.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
        jobjdID: this.jobJD.jobjdID,
        jobjdName: post.jobjdName,
        cityID: post.cityID,
        salaryrangeID: post.salaryrangeID,
        jobjdexperiance: post.jobjdexperiance,
        noticeID: post.noticeID,
        degreeID: post.degreeID,
        jobjdJobType: post.jobjdJobType,
        jobjdCertificatation: post.jobjdCertificatation,
        jobjdOpenings: post.jobjdOpenings,
        jobjdDescription: post.jobjdDescription,
        skilldetails: post.skills.length > 0 ? post.skills.map((skill: { skillName: string; skillID: string; }) => {
          return {skillName: skill.skillName, skillID: skill.skillID}; }) : [],
        jobjdFile: this.jobjdFile ? this.jobjdFile : this.jobJD.jobjdFile,
      };
      this.editPostJD(data).then(() => {
        this.spinner.hide();
        this.uploadFiles();
        setTimeout(() => {
          this.activeModal.close('edit-success');
          this.openSnackBar('Edited', 'success');
        }, 1000);
      }).catch((error) => {
        console.error(error);
        this.spinner.hide();
      });
    }
  }

  public editPostJD = (data: any) => {
    return new Promise((resolve, reject) => {
      this.employerService.editJobJd(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response[0].message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
