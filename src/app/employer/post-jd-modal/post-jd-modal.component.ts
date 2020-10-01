import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UploadFileDataEmployer, City, Notice, Skill } from 'src/app/candidateInterface';
import { HomeService } from 'src/app/home.service';
import { Subscription, Subject, of, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-post-jd-modal',
  templateUrl: './post-jd-modal.component.html',
  styleUrls: ['./post-jd-modal.component.css'],
})
export class PostJdModalComponent implements OnInit {
  postJDform: FormGroup;
  cityLists$: Observable<Array<City>>;
  noticeLists$: Observable<Array<Notice>>;
  sallaryRange$: Observable<Array<any>>;
  degreeLists$: Observable<Array<any>>;
  public makeItFalse = true;
  public sallaryRangeList = [];
  public cityLists = [];
  public noticeLists = [];
  public jobjdFile: any;
  public jobjdFileUrl: any;
  public selectedFiles: File[] = [];
  public fileToUpload = [];
  public postImageName = [];
  public employerData: any;
  public degreeLists = [];
  public postJDjobType = [
    'Full Time',
    'Half Days',
    'Work from Home',
    '2 Hrs only',
  ];
  public expYears = [
    { id: '0.0', value: 'Fresher' },
    { id: '1.0', value: '1 Years' },
    { id: '2.0', value: '2 Years' },
    { id: '3.0', value: '3 Years' },
    { id: '4.0', value: '4 Years' },
    { id: '5.0', value: '5 Years & Above' },
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
    this.postJDform = fb.group({
      jobjdName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]),
      ],
      cityID: [null, Validators.compose([Validators.required])],
      salaryrangeID: ['', Validators.compose([Validators.required])],
      jobjdexperiance: ['', Validators.compose([Validators.required])],
      skills: [[], Validators.compose([Validators.required])],
      noticeID: ['', Validators.compose([Validators.required])],
      degreeID: ['', Validators.compose([Validators.required])],
      jobjdOpenings: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      jobjdJobType: ['', Validators.compose([Validators.required])],
      jobjdCertificatation: ['', Validators.compose([Validators.required])],
      jobjdDescription: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.cityFromCached().then((cityList: Array<any>) => {
      if (cityList.length > 0) {
        this.cityLists = cityList;
        this.cityLists.sort((a, b) => {
          return a.cityID - b.cityID;
        });
      } else {
        this.cityLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.noticeFromCached().then((noticeList: Array<any>) => {
      if (noticeList.length > 0) {
        this.noticeLists = noticeList;
        this.noticeLists.sort((a, b) => {
          return a.noticeID - b.noticeID;
        });
      } else {
        this.noticeLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getSallaryRangeLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.sallaryRangeList = fulfilled;
      } else {
        this.sallaryRangeList = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getDegreeLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.degreeLists = fulfilled;
        this.degreeLists.sort((a, b) => {
          const nameA = a.degreeName.toUpperCase();
          const nameB = b.degreeName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      } else {
        this.degreeLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.skillslist$ = this.candidateService.skills;
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

  public cityFromCached = () => {
    return new Promise((resolve, reject) => {
      this.cityLists$ = this.candidateService.cities;
      this.cityLists$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
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
  public noticeFromCached = () => {
    return new Promise((resolve, reject) => {
      this.noticeLists$ = this.candidateService.notices;
      this.noticeLists$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
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
  public getSallaryRangeLists = () => {
    return new Promise((resolve, reject) => {
      this.sallaryRange$ = this.candidateService.sallary;
      this.sallaryRange$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        }, error => {
          reject(error);
        });
    });
  }
  public getDegreeLists = () => {
    return new Promise((resolve, reject) => {
      this.degreeLists$ = this.candidateService.degree;
      this.degreeLists$.subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
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

  public onSelectFile(event: any) {
    setTimeout(() => {
      this.prewiewImage(event);
    }, 300);
    this.selectedFiles.push(event.target.files[0] as File);
    this.postImageName.push(this.selectedFiles[0].name);
    this.jobjdFile = event.target.files[0].name;
  }

  // creating url for selected images
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
  } // end of uploadFiles

  public onPostJD = (post: any) => {
    this.markFormTouched(this.postJDform);
    if (this.postJDform.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
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
        jobjdFile: this.jobjdFile ? this.jobjdFile : '',
      };
      this.postJD(data).then(() => {
        this.spinner.hide();
        this.uploadFiles();
        setTimeout(() => {
          this.postJDform.reset();
          this.activeModal.close('success');
          this.openSnackBar('Posted', 'success');
        }, 1000);
      }).catch((error) => {
        console.error(error);
        this.spinner.hide();
      });
    }
  }

  public postJD = (data: any) => {
    return new Promise((resolve, reject) => {
      this.employerService.createJobJd(data).subscribe(
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
