import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CandidateRegistration, EmployerRegistration } from '../candidateInterface';
import { HomeService } from '../home.service';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmedValidator } from '../reset-password-modal/confirmed.validator';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.css'],
})
export class SignUpModalComponent implements OnInit, OnDestroy {
  @Input() isCandidateRegistration: boolean;
  @Input() isEmployeeRegistration: boolean;
  signForm: FormGroup;
  employerSignUpForm: FormGroup;
  public isCandidate = false;
  public isEmployer = false;
  public checked = true;
  public hide = true;
  public hideEmplyerPass = true;
  public languageList = [];
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  // candidate registration input data
  @Input() candidateRegistration = {
    employeeMobile: '',
    employeeName: '',
    employeeCountryCode: '91',
    employeeEmail: '',
    employeePassword: '',
    languageID: '1',
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public homeService: HomeService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public fb: FormBuilder
  ) {
    // for candidate
    this.signForm = fb.group({
      candidateUserName: [null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
        ],
      ],
      candidateMobileNumber: [null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ]),
      ],
      candidateEmail: [null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
      candidatePassword: [null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(4),
        ]),
      ],
      terms: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    // for employer
    this.employerSignUpForm = this.fb.group(
      {
        employerCompany: ['',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        employerMobile: ['',
          Validators.compose([
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ]),
        ],
        employerEmail: ['',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ]),
        ],
        employerPassword: ['',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        confirmedEmployerPassword: ['',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
          ]),
        ],
        employerContactName: ['',
          Validators.compose([
            Validators.required,
            Validators.min(3),
            Validators.max(30),
          ]),
        ],
        employerDesignation: ['',
          Validators.compose([
            Validators.required,
            Validators.min(3),
            Validators.max(30),
          ]),
        ],
        employerContactMobile: ['',
          Validators.compose([
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ]),
        ],
        employerTerms: [false, Validators.compose([Validators.required])],
      },
      {
        validators: [
          ConfirmedValidator('employerPassword', 'confirmedEmployerPassword'),
        ],
      }
    );
  }

  public myFunction() {
    this.hide = !this.hide;
  }
  public myFunctionPassOpen() {
    this.hideEmplyerPass = !this.hideEmplyerPass;
  }
  public onClose = () => {
    this.activeModal.close();
  }
  public onChangeRegisterEmployee() {
    this.isEmployeeRegistration = true;
    this.isCandidateRegistration = false;
  }
  public onChangeRegisterCandidate() {
    this.isCandidateRegistration = true;
    this.isEmployeeRegistration = false;
  }

  public openLoginModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(LoginModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.isCandidateLogin = true;
    modalRef.componentInstance.isEmployeeLogin = false;
  }

  public openVerificationModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(VerificationModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.isCandidateVerification = this.isCandidate;
    modalRef.componentInstance.isEmployerVerificationMobile = this.isEmployer;
    modalRef.componentInstance.signUpVerificationData = data;
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

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public submitEmployeeSignUpForm(post: any) {
    if (this.signForm.valid) {
      const data: CandidateRegistration = {
        languageID: this.candidateRegistration.languageID,
        employeeCountryCode: this.candidateRegistration.employeeCountryCode,
        employeeMobile: post.candidateMobileNumber,
        employeeName: post.candidateUserName,
        employeeEmail: post.candidateEmail,
        employeePassword: post.candidatePassword,
      };
      this.employeeRegistration(data).then((response: Array<any>) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          setTimeout(() => {
            this.isCandidate = true;
            this.isEmployer = false;
            this.openVerificationModal(response[0].data);
          }, 1500);
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
    } else {this.signForm.controls.terms.setValue(false); }
  }

  public submitEmployerSignUpForm(post: any) {
    if (this.employerSignUpForm.valid) {
      const data: EmployerRegistration = {
        languageID: '1',
        employerCountryCode: '91',
        employerMobile: post.employerMobile,
        employerCompany: post.employerCompany,
        employerEmail: post.employerEmail,
        employerPassword: post.employerPassword,
        employerContactName: post.employerContactName,
        employerContactCountryCode: '91',
        employerContactMobile: post.employerContactMobile,
        employerDesignation: post.employerDesignation,
      };
      this.employerRegistration(data).then((response: Array<any>) => {
        if (response[0].status === 'true') {
          this.spinner.hide();
          setTimeout(() => {
            this.isCandidate = false;
            this.isEmployer = true;
            this.openVerificationModal(response[0].data);
          }, 1500);
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
    } else {this.employerSignUpForm.controls.employerTerms.setValue(false); }
  }

  public checkEmployeeDuplication = (post: any) => {
    this.markFormTouched(this.signForm);
    if (this.signForm.valid) {
      this.spinner.show();
      const data = {
        employeeEmail: post.candidateEmail,
        employeeMobile: post.candidateMobileNumber,
        languageID: '1',
      };
      this.employeeDuplication(data).then((response: Array<any>) => {
        if (response[0].status === 'true') {
          this.submitEmployeeSignUpForm(post);
        } else if (response[0].message === 'Email already exist.') {
          this.spinner.hide();
          this.signForm.controls.candidateEmail.setErrors({
            emailAlreadyExist: true,
          });
        } else {
          this.spinner.hide();
          this.signForm.controls.candidateMobileNumber.setErrors({
            mobileExist: true,
          });
        }
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
    }
  }

  public checkEmployerDuplication = (post: any) => {
    this.markFormTouched(this.employerSignUpForm);
    if (this.employerSignUpForm.valid) {
      this.spinner.show();
      const data = {
        employerEmail: post.employerEmail,
        employerMobile: post.employerMobile,
        languageID: '1',
      };
      this.employerDuplication(data).then((response: Array<any>) => {
        if (response[0].status === 'true') {
          this.submitEmployerSignUpForm(post);
        } else if (response[0].message === 'Email already exist.') {
          this.spinner.hide();
          this.employerSignUpForm.controls.employerEmail.setErrors({
            emailAlreadyExist: true,
          });
        } else {
          this.spinner.hide();
          this.employerSignUpForm.controls.employerMobile.setErrors({
            mobileExist: true,
          });
        }
      }).catch(() => {
        this.spinner.hide();
        this.openSnackBar('some error occured', 'error');
      });
    }
  }

  public employerDuplication = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.checkEmployerDuplication(post).subscribe(
        (response) => { resolve(response); },
        error => { reject(error); });
    });
  }
  public employeeDuplication = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.checkEmployeeDuplication(post).subscribe(
        (response) => {
          resolve(response);
        }, error => { reject(error); });
    });
  }

  public employerRegistration = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.employerRegistration(post).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); });
    });
  }
  public employeeRegistration = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.registration(post).subscribe(
        (response) => { resolve(response); },
        (error) => { reject(error); });
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

  ngOnDestroy() { }
}
