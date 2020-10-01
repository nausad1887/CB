import { Component, OnInit, Input, KeyValueDiffers, DoCheck } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EmployerService } from '../employer.service';
import { Observable } from 'rxjs';
import { StateListData, UploadFileDataEmployer } from 'src/app/candidateInterface';
import { HomeService } from 'src/app/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css'],
})
export class EditProfileModalComponent implements OnInit, DoCheck {
  @Input() editableData: any;
  public differ: any;
  public countryID = '';
  public stateID = '';
  public makeItFalse = true;
  public industriesLists = [];
  public employeeStrengthLists = [];
  public ownerShipsLists = [];
  public countryLists = [];
  public stateLists = [];
  public cityLists = [];
  public selectedFiles: File[] = [];
  public businessCertificateName: string;
  public businessCertificateUrl: any;
  editForm: FormGroup;
  industriesLists$: Observable<Array<any>>;
  strengthLists$: Observable<Array<any>>;
  ownershipsLists$: Observable<Array<any>>;
  countryLists$: Observable<Array<any>>;
  stateLists$: Observable<Array<any>>;
  cityLists$: Observable<Array<any>>;
  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder,
    public employerService: EmployerService,
    public homeService: HomeService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      employerEmail: [
        this.editableData.employerEmail ?
          this.editableData.employerEmail : '',
        Validators.compose([Validators.required]),
      ],
      employerCompany: [
        this.editableData.employerCompany
          ? this.editableData.employerCompany
          : '',
        Validators.compose([Validators.required]),
      ],
      employerContactName: [
        this.editableData.employerContactName
          ? this.editableData.employerContactName
          : '',
        Validators.compose([Validators.required]),
      ],
      employerMobile: [
        {
          value: this.editableData.employerMobile
            ? this.editableData.employerMobile
            : '',
          disabled: true,
        },
      ],
      employerContactMobile: [
        this.editableData.employerContactMobile
          ? this.editableData.employerContactMobile
          : '',
        Validators.compose([Validators.required]),
      ],
      employerDesignation: [
        this.editableData.employerDesignation
          ? this.editableData.employerDesignation
          : '',
        Validators.compose([Validators.required]),
      ],
      employerLogo: [
        this.editableData.employerLogo ? this.editableData.employerLogo : '',
      ],
      countryID: [
        this.editableData.countryID && this.editableData.countryID !== '0'
          ? this.editableData.countryID
          : null,
        Validators.compose([Validators.required]),
      ],
      employerHqAddress: [
        this.editableData.employerHqAddress
          ? this.editableData.employerHqAddress
          : '',
        Validators.compose([Validators.required]),
      ],
      stateID: [
        this.editableData.stateID && this.editableData.stateID !== '0'
          ? this.editableData.stateID
          : null,
        Validators.compose([Validators.required]),
      ],
      cityID: [
        this.editableData.cityID && this.editableData.cityID !== '0'
          ? this.editableData.cityID
          : null,
        Validators.compose([Validators.required]),
      ],
      industryID: [
        this.editableData.industryID && this.editableData.industryID !== '0'
          ? this.editableData.industryID
          : '',
        Validators.compose([Validators.required]),
      ],
      empsizeID: [
        this.editableData.empsizeID && this.editableData.empsizeID !== '0'
          ? this.editableData.empsizeID
          : '',
        Validators.compose([Validators.required]),
      ],
      ownershipID: [
        this.editableData.ownershipID && this.editableData.ownershipID !== '0'
          ? this.editableData.ownershipID
          : '',
        Validators.compose([Validators.required]),
      ],
      employerAbout: [
        this.editableData.employerAbout ? this.editableData.employerAbout : '',
        Validators.compose([Validators.required]),
      ],
      employerBusinessCertiImage: [
        this.editableData.employerBusinessCertiImage
          ? this.editableData.employerBusinessCertiImage
          : '',
      ],
      employerBusinessCertiNumber: [
        this.editableData.employerBusinessCertiNumber
          ? this.editableData.employerBusinessCertiNumber
          : '',
        Validators.compose([Validators.required]),
      ],
    });
    this.editableData.countryID && this.editableData.countryID !== '0'
      ? this.getStateList(this.editableData.countryID).then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.stateLists = fulfilled;
          this.stateLists.sort((a, b) => {
            return a.stateID - b.stateID;
          });
        } else {
          this.stateLists = [];
        }
      }).catch((error) => {
        console.error(error);
      })
      : (this.editableData.countryID = '');
    this.editableData.stateID && this.editableData.stateID !== '0'
      ? this.getCities(this.editableData.stateID).then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.cityLists = fulfilled;
          this.cityLists.sort((a, b) => {
            return a.cityID - b.cityID;
          });
        } else {
          this.cityLists = [];
        }
      }).catch((error) => {
        console.error(error);
      })
      : (this.editableData.stateID = '');
    this.asyncPromiseCall();
  }

  onClose() {
    this.activeModal.close();
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'countryID') {
          this.getStateList(this.countryID).then((fulfilled: Array<any>) => {
            if (fulfilled.length > 0) {
              this.spinner.hide();
              this.stateLists = fulfilled;
              this.stateLists.sort((a, b) => {
                return a.stateID - b.stateID;
              });
            } else {
              this.spinner.hide();
              this.stateLists = [];
            }
          }).catch((error) => {
            this.spinner.hide();
            console.error(error);
          });
        }
        if (item.key === 'stateID') {
          this.getCities(this.stateID).then((fulfilled: Array<any>) => {
            if (fulfilled.length > 0) {
              this.spinner.hide();
              this.cityLists = fulfilled;
              this.cityLists.sort((a, b) => {
                return a.cityID - b.cityID;
              });
            } else {
              this.spinner.hide();
              this.cityLists = [];
            }
          }).catch((error) => {
            console.error(error);
            this.spinner.hide();
          });
        }
      });
    }
  }

  private clearStateOnChangeCountry = () => {
    this.editForm.get('stateID').patchValue(null);
  }
  private clearCityOnChangeState = () => {
    this.editForm.get('cityID').patchValue(null);
  }

  public onSelectCountry = (countryID: string) => {
    this.countryID = countryID;
    this.clearStateOnChangeCountry();
    this.clearCityOnChangeState();
    this.spinner.show();
  }
  public onSelectState = (stateID: string) => {
    this.stateID = stateID;
    this.clearCityOnChangeState();
    this.spinner.show();
  }

  public asyncPromiseCall = async () => {
    this.getIndustriesLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.industriesLists = fulfilled;
        this.industriesLists.sort((a, b) => {
          const nameA = a.industryName.toUpperCase();
          const nameB = b.industryName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.industriesLists = this.industriesLists.filter(
          (industry) => industry.industryName !== ''
        );
      } else {
        this.industriesLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getStrengthLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.employeeStrengthLists = fulfilled;
        this.employeeStrengthLists.sort((a, b) => {
          return a.empsizeID - b.empsizeID;
        });
      } else {
        this.employeeStrengthLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    this.getOwnerShipsLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.ownerShipsLists = fulfilled;
        this.ownerShipsLists.sort((a, b) => {
          return a.ownershipID - b.ownershipID;
        });
      } else {
        this.ownerShipsLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
    await this.getCountryLists().then((fulfilled: Array<any>) => {
      if (fulfilled.length > 0) {
        this.countryLists = fulfilled;
        this.countryLists.sort((a, b) => {
          return a.countryID - b.countryID;
        });
      } else {
        this.countryLists = [];
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  public getIndustriesLists = () => {
    return new Promise((resolve, reject) => {
      this.industriesLists$ = this.employerService.getIndustryLists;
      this.industriesLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
  public getStrengthLists = () => {
    return new Promise((resolve, reject) => {
      this.strengthLists$ = this.employerService.getEmployeeSizeLists;
      this.strengthLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
  public getOwnerShipsLists = () => {
    return new Promise((resolve, reject) => {
      this.ownershipsLists$ = this.employerService.getOwnershipLists;
      this.ownershipsLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
  public getCountryLists = () => {
    return new Promise((resolve, reject) => {
      this.countryLists$ = this.employerService.getCountryLists;
      this.countryLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
  public getStateList = (countryID: string) => {
    return new Promise((resolve, reject) => {
      const data: StateListData = { countryID: countryID ? countryID : '0', searchWord: '' };
      this.stateLists$ = this.employerService.stateLists(data);
      this.stateLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
  public getCities = (stateID: string) => {
    return new Promise((resolve, reject) => {
      const data = { countryID: this.countryID, stateID, searchWord: '' };
      this.cityLists$ = this.employerService.cityLists(data);
      this.cityLists$.subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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
    this.businessCertificateName = event.target.files[0].name;
  }

  public prewiewImage = (event: any) => {
    const reader = new FileReader();
    setTimeout(() => {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.makeItFalse = false;
        this.businessCertificateUrl = reader.result;
      };
    }, 100);
  }

  public uploadFiles = () => {
    this.selectedFiles.map((file) => {
      const data: UploadFileDataEmployer = {
        file,
        fileName: file.name,
        filePath: this.editableData.employerID,
        loginemployerID: this.editableData.employerID,
      };
      this.employerService.uploadFile(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            console.log('uploaded');
          } else {
            console.error(response[0].message);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    });
  } // end of uploadFiles

  public onSubmitEdit = (post: any) => {
    post.employerBusinessCertiImage = this.businessCertificateName;
    this.markFormTouched(this.editForm);
    if (this.editForm.valid) {
      this.spinner.show();
      post.loginemployerID = this.editableData.employerID;
      post.languageID = '1';
      this.employerService.updateEmployerProfile(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.uploadFiles();
            }, 500);
            this.homeService.getCurrentEmployerFromLocalStorage()
              ? this.homeService.setCurrentEmployerInLocalStorage(response[0].data[0])
              : this.homeService.setCurrentEmployerInSessionStorage(response[0].data[0]);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close('success');
              this.employerService.updateUserNav(response[0].data);
              this.openSnackBar('Profile Updated Successfully', 'success');
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'error');
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

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}
