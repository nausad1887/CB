import { Component, OnInit, Input } from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home.service';
import { ConfirmedValidator } from './confirmed.validator';
import { SpacesValidator } from './spaces.validator';
import { map } from 'rxjs/operators';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.css'],
})
export class ResetPasswordModalComponent implements OnInit {
  @Input() employee: boolean;
  @Input() employer: boolean;
  @Input() employeeData: any;
  modalOption: NgbModalOptions = {}; // not null!
  resetForm: FormGroup;
  employerResetForm: FormGroup;
  public hide = true;
  public closeResult: string;
  public passwordData = {
    languageID: '1',
    loginemployerID: '',
    employerNewPassword: '',
    loginemployeeID: '',
    employeeNewPassword: '',
    employeeReEnteredNewPassword: '',
  };
  constructor(
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
    private homeService: HomeService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    fb: FormBuilder
  ) {
    this.resetForm = fb.group(
      {
        employeeNewPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
        employeeReEnteredNewPassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
      },
      {
        validator: ConfirmedValidator(
          'employeeNewPassword',
          'employeeReEnteredNewPassword'
        ),
      }
    );

    // for employer
    this.employerResetForm = fb.group(
      {
        employeeNewPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
        employeeReEnteredNewPassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(4),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
          ]),
        ],
      },
      {
        validator: ConfirmedValidator(
          'employeeNewPassword',
          'employeeReEnteredNewPassword'
        ),
      }
    );
  }

  ngOnInit(): void {}

  myFunction() {
    this.hide = !this.hide;
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public backToVerificationModal = (data: any) => {
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
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  };

  public backToEmployerVerificationModal = (data: any) => {
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
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public onResetPasswordSubmit = (post: any) => {
    this.markFormTouched(this.resetForm);
    if (this.resetForm.valid) {
      this.spinner.show();
      this.passwordData.employeeNewPassword = post.employeeNewPassword;
      this.passwordData.employeeReEnteredNewPassword =
        post.employeeReEnteredNewPassword;
      this.passwordData.loginemployeeID = this.employeeData[0].employeeID;
      this.homeService.employeeResetPassword(this.passwordData).subscribe(
        (response) => {
          this.spinner.hide();
          if (response[0].status === 'true') {
            this.resetForm.reset();
            this.activeModal.close();
            setTimeout(() => {
              this.openSnackBar('Password Reset Successfully', 'success');
            }, 500);
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
      // do nothing
    }
  };

  public onEmployerResetPasswordSubmit = (post: any) => {
    this.markFormTouched(this.employerResetForm);
    if (this.employerResetForm.valid) {
      this.spinner.show();
      this.passwordData.employerNewPassword = post.employeeNewPassword;
      this.passwordData.loginemployerID = this.employeeData[0].employerID;
      this.homeService.employerResetPassword(this.passwordData).subscribe(
        (response) => {
          this.spinner.hide();
          if (response[0].status === 'true') {
            this.employerResetForm.reset();
            this.activeModal.close();
            setTimeout(() => {
              this.openSnackBar('Password Reset Successfully', 'success');
            }, 500);
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
      // do nothing
    }
  };

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
