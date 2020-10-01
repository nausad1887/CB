import { Component, OnInit, Input } from '@angular/core';
import {NgbModalOptions, NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forget-password-modal',
  templateUrl: './forget-password-modal.component.html',
  styleUrls: ['./forget-password-modal.component.css'],
})
export class ForgetPasswordModalComponent implements OnInit {
  @Input() employee: boolean;
  @Input() employer: boolean;
  modalOption: NgbModalOptions = {}; // not null!
  forgetForm: FormGroup;
  public closeResult: string;
  public data = {
    languageID: '1',
    employerCountryCode: '91',
    employeeMobile: '',
    employerMobile: '',
    employerEmail: '',
    employeeEmail: '',
    message: '',
  };
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    fb: FormBuilder
  ) {
    this.forgetForm = fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
          ),
        ]),
      ],
    });
  }

  ngOnInit(): void {}

  public onClose = () => {
    this.activeModal.close();
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public backToLoginModal = () => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      LoginModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        // this.checkStatus();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.isCandidateLogin = true;
    modalRef.componentInstance.isEmployeeLogin = false;
  }

  public openOtpVerificationModal = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeForgetPass = true;
    modalRef.componentInstance.employerForgetPass = false;
    modalRef.componentInstance.isCandidateVerification = false;
    modalRef.componentInstance.isEmployerVerificationMobile = false;
    modalRef.componentInstance.signUpVerificationData = data;
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

  public openOtpVerificationModalEmployer = (data: any) => {
    this.activeModal.close();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      VerificationModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeForgetPass = false;
    modalRef.componentInstance.employerForgetPass = true;
    modalRef.componentInstance.isCandidateVerification = false;
    modalRef.componentInstance.isEmployerVerificationMobile = false;
    modalRef.componentInstance.signUpVerificationData = data;
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

  public onSubmitEmailOrMobile = (post: any) => {
    this.markFormTouched(this.forgetForm);
    if (this.forgetForm.valid) {
      this.spinner.show();
      if (!isNaN(post.email)) {
        this.data.employeeMobile = post.email;
        this.data.employeeEmail = '';
        this.data.message = `mobile number.`;
      } else {
        this.data.employeeEmail = post.email;
        this.data.employeeMobile = '';
        this.data.message = `email.`;
      }
      this.homeService.employeeForgetPassword(this.data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.spinner.hide();
            this.openOtpVerificationModal(response[0].data);
            this.openSnackBar(
              `we have sent otp to your registered ${this.data.message}`,
              'success'
            );
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
    } else {
      // this.forgetForm.controls.terms.setValue(false);
    }
  }

  public onSubmitEmployerEmailOrMobile = (post: any) => {
    this.markFormTouched(this.forgetForm);
    if (this.forgetForm.valid) {
      this.spinner.show();
      if (!isNaN(post.email)) {
        this.data.employerMobile = post.email;
        this.data.employerEmail = '';
        this.data.message = `mobile number.`;
      } else {
        this.data.employerEmail = post.email;
        this.data.employerMobile = '';
        this.data.message = `email.`;
      }
      this.homeService.employerForgetPassword(this.data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.spinner.hide();
            this.openOtpVerificationModalEmployer(response[0].data);
            this.openSnackBar(
              `we have sent otp to your registered ${this.data.message}`,
              'success'
            );
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
    } else {
      // this.forgetForm.controls.terms.setValue(false);
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
}
