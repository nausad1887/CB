import { Component, OnInit, Input, DoCheck, KeyValueDiffers } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CandidateService } from '../candidate.service';
import { HomeService } from '../../home.service';
import { StateListData, UploadFileData } from 'src/app/candidateInterface';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-basic-update-modal',
  templateUrl: './basic-update-modal.component.html',
  styleUrls: ['./basic-update-modal.component.css'],
})
export class BasicUpdateModalComponent implements OnInit, DoCheck {
  @Input() kycinfo: any;
  public differ: any;
  public countryID = '';
  public stateID = '';
  public countryLists = [];
  public stateLists = [];
  public cityLists = [];
  public availableList = [];
  public noticeLists = [];
  public proofOfAdd = [];
  public proofOfID = [];
  public sallaryRangeList = [];
  public selectedProofID = false;
  public selectedProofOfAdd = false;
  public makeItFalseAddressInput = true;
  public makeItFalseIDInput = true;
  public selectedProofIDName: string;
  public selectedProofOfAddName: string;
  public employeeData: any;
  public proofOfAddUrl: any;
  public proofOfIDUrl: any;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public currencyList = ['INR', 'USD', 'EUR', 'NZD'];
  public totalExpYears = [
    { id: '1', yr: '1 Years' },
    { id: '2', yr: '2 Years' },
    { id: '3', yr: '3 Years' },
    { id: '4', yr: '4 Years' },
    { id: '5', yr: '5 Years & Above' },
  ];
  public totalExpMonths = [
    { id: '1', mt: '1 Months' },
    { id: '2', mt: '2 Months' },
    { id: '3', mt: '3 Months' },
    { id: '4', mt: '4 Months' },
    { id: '5', mt: '5 Months & Above' },
  ];
  public totalReExpYears = [
    { id: '1', yr: '1 Years' },
    { id: '2', yr: '2 Years' },
    { id: '3', yr: '3 Years' },
    { id: '4', yr: '4 Years' },
    { id: '5', yr: '5 Years & Above' },
  ];
  public totalReExpMonths = [
    { id: '1', mt: '1 Months' },
    { id: '2', mt: '2 Months' },
    { id: '3', mt: '3 Months' },
    { id: '4', mt: '4 Months' },
    { id: '5', mt: '5 Months & Above' },
  ];
  public currentSallaryInLacs = [
    '1 Lacs',
    '2 Lacs',
    '3 Lacs',
    '4 Lacs',
    '5 Lacs & Above',
  ];
  public currentSallaryInThousands = [
    '10 Thousands',
    '20 Thousands',
    '30 Thousands',
    '40 Thousands',
    '5 Thousands & Above',
  ];
  public level = [
    {
      id: 'Yes',
      value: 'Fresher',
      checked: false,
    },
    {
      id: 'No',
      value: 'Experienced',
      checked: true,
    },
  ];
  public kycData = {
    languageID: '1',
    loginemployeeID: '',
    employeeFirstname: '',
    employeeLastname: '',
    empkycFresher: 'No',
    empkycExpYear: '',
    empkycExpMonth: '',
    empkycRelExpYear: '',
    empkycRelExpMonth: '',
    empkycCTCPA: '',
    empkycETCPA: '',
    noticeID: '',
    avialablefromID: '',
    empkycInterviewFrom: '',
    empkycInterviewTo: '',
    proofidID: '',
    empkycProofidImage: '',
    empkycProofidNumber: '',
    proofaddID: '',
    empkycProofaddNumber: '',
    empkycProofaddImage: '',
    empkycPassportImage: '',
    empkycWorkPermitCountryID: '',
    empkycWorkPermittTill: '',
    countryID: '',
    stateID: '',
    cityID: '',
    empkycCTCPACurrency: '',
    empkycETCPACurrency: '',
  };
  public employeeBasicData = {};
  public selectedFiles: File[] = [];
  public fileToUpload = [];
  public postImageName = [];
  public employeeFullName: string;
  public employeeSplitName = [];
  public kycEmployeeForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    public candidateService: CandidateService,
    public homeService: HomeService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    // form elements
    this.kycEmployeeForm = this.fb.group({
      employeeFirstname: [
        this.kycinfo.employeeFirstname ? this.kycinfo.employeeFirstname : '',
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(30),
            Validators.minLength(3),
          ]),
        ],
      ],
      employeeLastname: [
        this.kycinfo.employeeLastname ? this.kycinfo.employeeLastname : '',
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(30),
            Validators.minLength(3),
          ]),
        ],
      ],
      employeeCountryID: [
        this.kycinfo.countryID && this.kycinfo.countryID !== '0'
          ? this.kycinfo.countryID
          : null,
        [Validators.compose([Validators.required])],
      ],
      employeeStateID: [
        this.kycinfo.stateID && this.kycinfo.stateID !== '0'
          ? this.kycinfo.stateID
          : null,
        [Validators.compose([Validators.required])],
      ],
      employeeCityID: [
        this.kycinfo.cityID && this.kycinfo.cityID !== '0'
          ? this.kycinfo.cityID
          : null,
        [Validators.compose([Validators.required])],
      ],
      employeeExpYr: [
        this.kycinfo.empkycExpYear ? this.kycinfo.empkycExpYear : '',
        [Validators.compose([Validators.required])],
      ],
      employeeExpMnt: [
        this.kycinfo.empkycExpMonth ? this.kycinfo.empkycExpMonth : '',
        [Validators.compose([Validators.required])],
      ],
      employeeRelvExpYr: [
        this.kycinfo.empkycRelExpYear ? this.kycinfo.empkycRelExpYear : '',
        [Validators.compose([Validators.required])],
      ],
      employeeRelvExpMnt: [
        this.kycinfo.empkycRelExpMonth ? this.kycinfo.empkycRelExpMonth : '',
        [Validators.compose([Validators.required])],
      ],
      employeeCurrentSallaryInLacs: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeCurrentSallaryInThousand: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeCurrentSallaryCurrency: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeExpectedSallaryInLacs: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeExpectedSallaryInThousand: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeExpectedSallaryCurrency: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeNoticePeriod: [
        this.kycinfo.noticeID ? this.kycinfo.noticeID : '',
        [Validators.compose([Validators.required])],
      ],
      employeeAvailableFrom: [
        this.kycinfo.avialablefromID ? this.kycinfo.avialablefromID : '',
        [Validators.compose([Validators.required])],
      ],
      employeeInterviewFromTime: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeInterviewToTime: [
        '',
        [Validators.compose([Validators.required])],
      ],
      employeeProofOfIdentityID: [
        this.kycinfo.proofidID ? this.kycinfo.proofidID : '',
        [Validators.compose([Validators.required])],
      ],
      employeeProofOfIdentityNumber: [
        this.kycinfo.empkycProofidNumber
          ? this.kycinfo.empkycProofidNumber
          : '',
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(9),
          ]),
        ],
      ],
      employeeProofOfAddressID: [
        this.kycinfo.proofaddID ? this.kycinfo.proofaddID : '',
        [Validators.compose([Validators.required])],
      ],
      employeeProofOfAddressNumber: [
        this.kycinfo.empkycProofaddNumber
          ? this.kycinfo.empkycProofaddNumber
          : '',
        [
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(9),
          ]),
        ],
      ],
      employeeWorkPermitCountry: [
        this.kycinfo.empkycWorkPermitCountryID &&
          this.kycinfo.empkycWorkPermitCountryID !== '0'
          ? this.kycinfo.empkycWorkPermitCountryID
          : '',
        [Validators.compose([Validators.required])],
      ],
      employeeWorkPermitValidTill: [
        this.kycinfo.empkycWorkPermittTill
          ? this.kycinfo.empkycWorkPermittTill
          : '',
        [Validators.compose([Validators.required])],
      ],
      employeeMoblie: [
        this.kycinfo.employeeMobile ? this.kycinfo.employeeMobile : '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]),
      ],
      employeeEmail: [
        this.kycinfo.employeeEmail ? this.kycinfo.employeeEmail : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
    });

    this.kycinfo.countryID
      ? this.getStateList(this.countryID).then((fulfilled: Array<any>) => {
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
      })
      : (this.kycinfo.countryID = '');
    this.kycinfo.stateID
      ? this.getCities(this.stateID).then((fulfilled: Array<any>) => {
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
      })
      : (this.kycinfo.stateID = '');
    this.kycinfo.proofidID
      ? this.onProofOfID(this.kycinfo.proofidID)
      : (this.kycinfo.proofidID = '');
    this.kycinfo.proofaddID
      ? this.onProofOfAdd(this.kycinfo.proofaddID)
      : (this.kycinfo.proofaddID = '');
    this.checkStatus();
    this.asyncFunctionCall();
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.kycData.loginemployeeID = this.employeeData.employeeID;
  }

  public asyncFunctionCall = async () => {
    await this.getCountryLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.countryLists = fulfilled;
        } else {
          this.countryLists = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.getAvailableLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.availableList = fulfilled;
        } else {
          this.availableList = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.getNoticeLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.noticeLists = fulfilled;
        } else {
          this.noticeLists = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.getSallaryRangeLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.sallaryRangeList = fulfilled;
        } else {
          this.sallaryRangeList = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.getProofOfIDLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.proofOfID = fulfilled;
        } else {
          this.proofOfID = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.getProofOfAddressLists()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.proofOfAdd = fulfilled;
        } else {
          this.proofOfAdd = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public getCountryLists = () => {
    return new Promise((resolve, reject) => {
      const data = {searchWord: ''};
      this.candidateService.getCountryLists(data).subscribe(
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
    this.kycEmployeeForm.get('employeeStateID').patchValue(null);
  }
  private clearCityOnChangeState = () => {
    this.kycEmployeeForm.get('employeeCityID').patchValue(null);
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

  public onClickChangeLevel = (level: any) => {
    this.kycData.empkycFresher = level;
  }

  public onProofOfID = (proofID: string) => {
    if (proofID === undefined || proofID === null || proofID === '') {
      this.selectedProofID = false;
    } else {
      this.selectedProofIDName = this.kycinfo.proofidName;
      this.selectedProofID = true;
    }
  }

  public onProofOfAdd = (proofadd: string) => {
    if (proofadd === undefined || proofadd === null || proofadd === '') {
      this.selectedProofOfAdd = false;
    } else {
      this.selectedProofOfAddName = this.kycinfo.proofaddName;
      this.selectedProofOfAdd = true;
    }
  }

  public onSelectProofOfID = (proofID: any) => {
    if (proofID === undefined || proofID === null || proofID === '') {
      this.selectedProofID = false;
    } else {
      for (const proof of this.proofOfID) {
        if (proof.proofidID === proofID) {
          this.selectedProofIDName = proof.proofidName;
        }
      }
      this.selectedProofID = true;
    }
  }

  public onSelectProofOfAdd = (proofadd: any) => {
    if (proofadd === undefined || proofadd === null || proofadd === '') {
      this.selectedProofOfAdd = false;
    } else {
      for (const proof of this.proofOfAdd) {
        if (proof.proofaddID === proofadd) {
          this.selectedProofOfAddName = proof.proofaddName;
        }
      }
      this.selectedProofOfAdd = true;
    }
  }

  public getStateList = (selectedcountryID: string) => {
    return new Promise((resolve, reject) => {
      const data: StateListData = { countryID: selectedcountryID, searchWord: '' };
      this.candidateService.getStateLists(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else { resolve([]); }
        },
        (error) => { reject(error); });
    });
  }

  public getCities = (selectedStateData: any) => {
    return new Promise((resolve, reject) => {
      const data = { countryID: this.kycData.countryID, stateID: selectedStateData, searchWord: '' };
      return this.candidateService.getCityLists(data).subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else { resolve([]); }
        },
        (error) => { reject(error); });
    });
  }

  public getAvailableLists = () => {
    return new Promise((resolve, reject) => {
      const data = { searchWord: '' };
      this.candidateService.getAvailableFromLists(data).subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        },
        (error) => { reject(error); }
      );
    });
  }

  public getNoticeLists = () => {
    return new Promise((resolve, reject) => {
      const data = { searchWord: '' };
      this.candidateService.getNoticeLists(data).subscribe(
        (response) => {
          if (response.length > 0) {
            resolve(response);
          } else {
            resolve([]);
          }
        },
        (error) => { reject(error); }
      );
    });
  }

  public getProofOfAddressLists = () => {
    return new Promise((resolve, reject) => {
      this.candidateService.getProofOfAddressLists().subscribe(
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

  public getProofOfIDLists = () => {
    return new Promise((resolve, reject) => {
      this.candidateService.getProofOfIDLists().subscribe(
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

  public getSallaryRangeLists = () => {
    return new Promise((resolve, reject) => {
      this.candidateService.getSallaryRangeLists().subscribe(
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

  // creating url for selected images
  public prewiewImageAddress = (event: any) => {
    const reader = new FileReader();
    setTimeout(() => {
      reader.readAsDataURL(event.target.files[0]);
      // tslint:disable-next-line: variable-name
      reader.onload = (_event) => {
        this.makeItFalseAddressInput = false;
        this.proofOfAddUrl = reader.result;
      };
    }, 100);
  } // end of prewiew image function

  // creating url for selected images
  public prewiewImageID = (event: any) => {
    const reader = new FileReader();
    setTimeout(() => {
      reader.readAsDataURL(event.target.files[0]);
      // tslint:disable-next-line: variable-name
      reader.onload = (_event) => {
        this.makeItFalseIDInput = false;
        this.proofOfIDUrl = reader.result;
      };
    }, 100);
  } // end of prewiew image function

  public kycProofIDfileAdded(event: any) {
    setTimeout(() => {
      this.prewiewImageAddress(event);
    }, 300);
    this.selectedFiles.push(event.target.files[0] as File);
    this.postImageName.push(this.selectedFiles[0].name);
    this.kycData.empkycProofidImage = event.target.files[0].name;
  } // end of fileAdded function

  public kycProofADDfileAdded(event: any) {
    setTimeout(() => {
      this.prewiewImageID(event);
    }, 300);
    this.selectedFiles.push(event.target.files[0] as File);
    this.postImageName.push(this.selectedFiles[0].name);
    this.kycData.empkycProofaddImage = event.target.files[0].name;
  } //

  // uploading files when post success
  public uploadFiles = () => {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.fileToUpload.push(this.selectedFiles[i]);
      const data: UploadFileData = {
        file: this.fileToUpload[i],
        fileName: this.postImageName[i],
        filePath: this.employeeData.loginemployeeID,
        loginemployeeID: this.employeeData.loginemployeeID,
      };
      this.candidateService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
        } else {
        }
      });
    }
  } // end of uploadFiles

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  // convert 12 hours to 24 hours
  public convertTime12to24 = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    // tslint:disable-next-line: prefer-const
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      const newHours = parseInt(hours, 10) + 12;
      hours = newHours.toString();
    }
    return `${hours}:${minutes}`;
  }

  public createKycDetails = (post: any) => {
    this.markFormTouched(this.kycEmployeeForm);
    if (this.kycEmployeeForm.valid) {
      if (!this.kycData.empkycFresher) {
        this.openSnackBar('Please Select Experiance Level', 'warning');
      } else {
        this.kycData.employeeFirstname = post.employeeFirstname;
        this.kycData.employeeLastname = post.employeeLastname;
        this.kycData.countryID = post.employeeCountryID;
        this.kycData.stateID = post.employeeStateID;
        this.kycData.cityID = post.employeeCityID;
        this.kycData.empkycExpYear = post.employeeExpYr;
        this.kycData.empkycExpMonth = post.employeeExpMnt;
        this.kycData.empkycRelExpYear = post.employeeRelvExpYr;
        this.kycData.empkycRelExpMonth = post.employeeRelvExpMnt;
        this.kycData.empkycCTCPA = post.employeeCurrentSallaryInLacs;
        this.kycData.empkycCTCPACurrency = post.employeeCurrentSallaryCurrency;
        this.kycData.empkycETCPA = post.employeeExpectedSallaryInLacs;
        this.kycData.empkycETCPACurrency = post.employeeExpectedSallaryCurrency;
        this.kycData.noticeID = post.employeeNoticePeriod;
        this.kycData.avialablefromID = post.employeeAvailableFrom;
        this.kycData.empkycInterviewFrom = this.convertTime12to24(post.employeeInterviewFromTime);
        this.kycData.empkycInterviewTo = this.convertTime12to24(post.employeeInterviewToTime);
        this.kycData.proofidID = post.employeeProofOfIdentityID;
        this.kycData.empkycProofidNumber = post.employeeProofOfIdentityNumber;
        this.kycData.proofaddID = post.employeeProofOfAddressID;
        this.kycData.empkycProofaddNumber = post.employeeProofOfAddressNumber;
        this.kycData.empkycWorkPermitCountryID = post.employeeWorkPermitCountry;
        this.kycData.empkycWorkPermittTill = post.employeeWorkPermitValidTill;
        this.spinner.show();
        this.candidateService.employeeBasicUpdate(this.kycData).subscribe(
          (response) => {
            if (response[0].status === 'true') {
              setTimeout(() => {
                this.kycEmployeeForm.reset();
                this.updateData(response[0].data);
                this.activeModal.close();
                this.uploadFiles();
                this.spinner.hide();
              }, 500);
              this.openSnackBar('Kyc Updated', 'success');
            } else {
              this.spinner.hide();
              console.error(response[0].message);
              this.openSnackBar(response[0].message, 'error');
            }
          },
          (error) => {
            this.spinner.hide();
            console.error(error);
          }
        );
      }
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

  public dismiss() {
    this.activeModal.close();
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
