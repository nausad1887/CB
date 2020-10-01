import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
import { ForgetPasswordModalComponent } from '../forget-password-modal/forget-password-modal.component';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.css'],
})
export class VerificationModalComponent implements OnInit {
  @Input() isCandidateVerification: boolean;
  @Input() isEmployerVerificationMobile: boolean;
  @Input() employeeForgetPass: boolean;
  @Input() employerForgetPass: boolean;
  @Input() signUpVerificationData: any;
  public isEmployerVerificationEmail = false;
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;

  public otp = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  constructor(
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      $('input.mobile-verify.pass').on('keyup', function() {
        if ($(this).val()) {
          // tslint:disable-next-line: deprecation
          $(this).closest('div').next().find('input').focus();
          // $(this).next().focus();
        }
      });
    });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public onResendEmployerMobileClick = (form: NgForm) => {
    this.spinner.show();
    const data = {
      languageID: '1',
      loginemployerID: this.signUpVerificationData[0].employerID,
      employerMobile: this.signUpVerificationData[0].employerMobile,
    };
    this.homeService.employerResendOtp(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          form.resetForm();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public onResendClick = (form: NgForm) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.signUpVerificationData[0].employeeID,
      employeeMobile: this.signUpVerificationData[0].employeeMobile,
    };
    this.homeService.employeeResendOtp(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          form.resetForm();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public onEmployerResendClick = (form: NgForm) => {
    this.spinner.show();
    const data = {
      languageID: '1',
      loginemployerID: this.signUpVerificationData[0].employerID,
      employerMobile: this.signUpVerificationData[0].employerMobile,
    };
    this.homeService.employerResendOtp(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          form.resetForm();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public onEmailResendClick = (form: NgForm) => {
    this.spinner.show();
    const data = {
      languageID: '1',
      loginemployerID: this.signUpVerificationData[0].employerID,
      employerEmail: this.signUpVerificationData[0].employerEmail,
    };
    this.homeService.employerEmailResendOtp(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          form.resetForm();
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'success');
        } else {
          this.spinner.hide();
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public openResetPasswordModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ResetPasswordModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeData = data;
    modalRef.componentInstance.employee = true;
    modalRef.componentInstance.employer = false;
    modalRef.result.then(
      (result) => {
        // this.checkStatus();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public openEmployerResetPasswordModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ResetPasswordModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeData = data;
    modalRef.componentInstance.employee = false;
    modalRef.componentInstance.employer = true;
    modalRef.result.then(
      (result) => {
        // this.checkStatus();
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

  public onContactVerifyClick = (form: NgForm) => {
    if (!this.otp.one) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.two) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.three) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.four) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else {
      this.spinner.show();
      const otp1 = this.otp.one.concat(this.otp.two);
      const otp2 = this.otp.three.concat(this.otp.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        loginemployeeID: this.signUpVerificationData[0].employeeID,
        employeeOTP: otpSubmit,
      };
      this.homeService.employeeVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.homeService.setCurrentUserInSessionStorage(response[0].data[0]);
            this.homeService.isCandidateTrue(true);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
              form.resetForm();
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
            setTimeout(() => {
              this.openSnackBar('Click On Resend', 'hint');
            }, 2000);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public onEmployerContactVerifyClick = (form: NgForm) => {
    if (!this.otp.one) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.two) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.three) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.four) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else {
      this.spinner.show();
      const otp1 = this.otp.one.concat(this.otp.two);
      const otp2 = this.otp.three.concat(this.otp.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        languageID: '1',
        loginemployerID: this.signUpVerificationData[0].employerID,
        employerOTP: otpSubmit,
      };
      this.homeService.employerVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              form.resetForm();
              this.isEmployerVerificationMobile = false;
              this.isEmployerVerificationEmail = true;
              this.ngOnInit();
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
            setTimeout(() => {
              this.openSnackBar('Click On Resend', 'hint');
            }, 2000);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public onEmployerEmailVerifyClick = (form: NgForm) => {
    if (!this.otp.one) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.two) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.three) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.four) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else {
      this.spinner.show();
      const otp1 = this.otp.one.concat(this.otp.two);
      const otp2 = this.otp.three.concat(this.otp.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        languageID: '1',
        loginemployerID: this.signUpVerificationData[0].employerID,
        employerEmailOTP: otpSubmit,
      };
      this.homeService.employerEmailVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.homeService.setCurrentEmployerInSessionStorage(
              response[0].data[0]
            );
            this.homeService.isEmployerTrue(true);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
              form.resetForm();
              this.router.navigate(['/employer-dashboard']);
              this.homeService.removeEmployerLocalStorage();
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
            setTimeout(() => {
              this.openSnackBar('Click On Resend', 'hint');
            }, 2000);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public backToEmployerForgetPasswordModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ForgetPasswordModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employee = false;
    modalRef.componentInstance.employer = true;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public backToForgetPasswordModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ForgetPasswordModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employee = true;
    modalRef.componentInstance.employer = false;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public onSubmitResetPasswordOTP = (form: NgForm) => {
    if (!this.otp.one) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.two) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.three) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.four) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else {
      this.spinner.show();
      const otp1 = this.otp.one.concat(this.otp.two);
      const otp2 = this.otp.three.concat(this.otp.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        loginemployeeID: this.signUpVerificationData[0].employeeID,
        employeeOTP: otpSubmit,
      };
      this.homeService.employeeVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              this.openSnackBar(response[0].message, 'success');
              this.openResetPasswordModal(response[0].data);
              form.resetForm();
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
            setTimeout(() => {
              this.openSnackBar('Click On Resend', 'hint');
            }, 2000);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public onSubmitEmployerResetPasswordOTP = (form: NgForm) => {
    if (!this.otp.one) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.two) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.three) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else if (!this.otp.four) {
      this.openSnackBar('Please Enter otp Correctly', 'error');
    } else {
      this.spinner.show();
      const otp1 = this.otp.one.concat(this.otp.two);
      const otp2 = this.otp.three.concat(this.otp.four);
      const otpSubmit = otp1.concat(otp2);
      const data = {
        languageID: '1',
        loginemployerID: this.signUpVerificationData[0].employerID,
        employerOTP: otpSubmit,
      };
      this.homeService.employerVerification(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              this.openSnackBar(response[0].message, 'success');
              this.openEmployerResetPasswordModal(response[0].data);
              form.resetForm();
            }, 1000);
          } else {
            this.spinner.hide();
            this.openSnackBar(response[0].message, 'false');
            setTimeout(() => {
              this.openSnackBar('Click On Resend', 'hint');
            }, 2000);
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
