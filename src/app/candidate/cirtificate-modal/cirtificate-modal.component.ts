import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cirtificate-modal',
  templateUrl: './cirtificate-modal.component.html',
  styleUrls: ['./cirtificate-modal.component.css'],
})
export class CirtificateModalComponent implements OnInit {
  @Input() addCertificate: boolean;
  @Input() editCertificate: boolean;
  @Input() editableData: any;
  public employeeData: any;
  public addCertificateData = {
    loginemployeeID: '',
    empcertificateName: '',
    empcertificateIssuedBy: '',
    empcertificateValidTill: '',
    empcertificateID: '',
  };
  constructor(
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    public toastr: ToastrManager,
    public homeService: HomeService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (!this.editableData) {
      // do nothinf
    } else {
      this.addCertificateData.empcertificateName = this.editableData
        .empcertificateName
        ? this.editableData.empcertificateName
        : '';
      this.addCertificateData.empcertificateIssuedBy = this.editableData
        .empcertificateIssuedBy
        ? this.editableData.empcertificateIssuedBy
        : '';
      this.addCertificateData.empcertificateValidTill = this.editableData
        .empcertificateValidTill
        ? this.editableData.empcertificateValidTill
        : '';
      this.addCertificateData.loginemployeeID = this.editableData.employeeID;
      this.addCertificateData.empcertificateID = this.editableData.empcertificateID;
    }
    this.checkStatus();
  }

  public onCloseModal = () => {
    this.activeModal.close();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onSubmitAddCertificate = (form: NgForm) => {
    this.spinner.show();
    this.addCertificateData.loginemployeeID = this.employeeData.employeeID;
    this.candidateService
      .addEmployeeCertificate(this.addCertificateData)
      .subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              form.resetForm();
              this.spinner.hide();
              this.activeModal.close();
            }, 1500);
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
  }

  public onSubmitEditCertificate = (editForm: NgForm) => {
    this.spinner.show();
    this.candidateService
      .editEmployeeCertificate(this.addCertificateData)
      .subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              editForm.resetForm();
              this.spinner.hide();
              this.activeModal.close();
            }, 1500);
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
  }

  public deleteCertificate = (empcertificateID: string) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.addCertificateData.loginemployeeID,
      empcertificateID,
    };
    this.candidateService.deleteEmployeeCertificate(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          setTimeout(() => {
            this.spinner.hide();
            this.toastr.successToastr('Removed');
            this.activeModal.close();
          }, 1500);
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
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
