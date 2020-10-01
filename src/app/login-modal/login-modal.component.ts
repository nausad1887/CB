import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbModalOptions, ModalDismissReasons, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { SignUpModalComponent } from '../sign-up-modal/sign-up-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { CandidateLogin, EmployerLogin } from '../candidateInterface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgetPasswordModalComponent } from '../forget-password-modal/forget-password-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements OnInit {
  @Input() isCandidateLogin: boolean;
  @Input() isEmployeeLogin: boolean;
  public hide = true;
  public hidePassword = true;
  public loginForm: FormGroup;
  public employerLoginForm: FormGroup;
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; // not null!
  // candidate login input data
  @Input() candidateLogin = {
    languageID: '1',
  };
  @Input() partnerLogin = {
    languageID: '1',
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private homeService: HomeService,
    private snackBar: MatSnackBar,
    public router: Router,
    fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      password: [null, Validators.required],
      terms: [true],
    });
    // employer login
    this.employerLoginForm = fb.group({
      employerEmail: [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
      employerPassword: [null, Validators.required],
      employerTerms: [true],
    });
  }

  ngOnInit(): void { }

  public onClose = () => {
    this.activeModal.close();
  }
  public myFunction() {
    this.hide = !this.hide;
  }
  public myEmployerFunction() {
    this.hidePassword = !this.hidePassword;
  }
  public onChangeLoginEmployee() {
    this.isEmployeeLogin = true;
    this.isCandidateLogin = false;
  }
  public onChangeLoginCandidate() {
    this.isEmployeeLogin = false;
    this.isCandidateLogin = true;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public openSignModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(SignUpModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.isCandidateRegistration = true;
    modalRef.componentInstance.isEmployeeRegistration = false;
  }

  public openForgetPasswordModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ForgetPasswordModalComponent, this.modalOption);
    modalRef.componentInstance.employee = true;
    modalRef.componentInstance.employer = false;
    modalRef.result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }

  public openEmployerForgetPasswordModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ForgetPasswordModalComponent, this.modalOption);
    modalRef.componentInstance.employee = false;
    modalRef.componentInstance.employer = true;
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

  public onClickEmployerLogin = (post: any) => {
    this.markFormTouched(this.employerLoginForm);
    if (this.employerLoginForm.valid) {
      this.spinner.show();
      const data: EmployerLogin = {
        languageID: this.partnerLogin.languageID,
        employerMobile: post.employerEmail,
        employerPassword: post.employerPassword,
      };
      this.employerLogin(data).then((response: Array<any>) => {
          this.spinner.hide();
          setTimeout(() => {
            this.activeModal.close();
            this.employerLoginForm.reset();
            if (post.employerTerms === true) {
              this.homeService.setCurrentEmployerInLocalStorage(response[0]);
              this.homeService.isEmployerTrue(true);
              this.homeService.removeEmployerSessionStorage();
              this.router.navigate(['/employer-dashboard']);
            } else {
              this.homeService.setCurrentEmployerInSessionStorage(response[0]);
              this.homeService.isEmployerTrue(true);
              this.homeService.removeEmployerLocalStorage();
              this.router.navigate(['/employer-dashboard']);
            }
          }, 1500);
      }).catch((error: Array<any>) => {
        if (error.length > 0){
          this.spinner.hide();
          this.openSnackBar(error[0].message, error[0].status);
        }else{
          this.spinner.hide();
          this.openSnackBar('some error occured', 'error');
        }
      });
    } else {this.employerLoginForm.controls.employerTerms.setValue(false); }
  }

  public onClickEmployeeLogin(post: any) {
    this.markFormTouched(this.loginForm);
    if (this.loginForm.valid) {
      this.spinner.show();
      const data: CandidateLogin = {
        languageID: this.candidateLogin.languageID,
        employeeMobile: post.email,
        employeePassword: post.password,
      };
      this.employeeLogin(data).then((success: Array<any>) => {
        this.spinner.hide();
        setTimeout(() => {
              this.activeModal.close();
              this.loginForm.reset();
              if (post.terms === true) {
                this.homeService.setCurrentUserInLocalStorage(success[0]);
                this.homeService.isCandidateTrue(true);
                this.homeService.removeSessionStorage();
                this.router.navigate(['/dashboard']);
              } else {
                this.homeService.setCurrentUserInSessionStorage(success[0]);
                this.homeService.isCandidateTrue(true);
                this.homeService.removeLocalStorage();
                this.router.navigate(['/dashboard']);
              }
            }, 700);
      }).catch((error: Array<any>) => {
        if (error.length > 0){
          this.spinner.hide();
          this.openSnackBar(error[0].message, error[0].status);
        }else{
          this.spinner.hide();
          this.openSnackBar('some error occured', 'error');
        }
      });
    } else {this.loginForm.controls.terms.setValue(false); }
  }

  public employeeLogin = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.login(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response);
          }
        }, () => {
          reject([]);
        }
      );
    });
  }
  public employerLogin = (post: any) => {
    return new Promise((resolve, reject) => {
      this.homeService.employerLogin(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject(response);
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
