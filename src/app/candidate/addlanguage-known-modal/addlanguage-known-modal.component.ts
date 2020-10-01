import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addlanguage-known-modal',
  templateUrl: './addlanguage-known-modal.component.html',
  styleUrls: ['./addlanguage-known-modal.component.css'],
})
export class AddlanguageKnownModalComponent implements OnInit {
  @Input() addLanguage: boolean;
  @Input() editLanguage: boolean;
  @Input() editableData: any;
  public employeeData: any;
  public languageKnownData = {
    loginemployeeID: '',
    emplanguageName: '',
    emplanguageRead: '',
    emplanguageWrite: '',
    emplanguageSpeak: '',
    emplanguageID: '',
  };
  public readStatus = [
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' },
  ];
  public writeStatus = [
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' },
  ];
  public speakStatus = [
    { id: '1', value: 'Yes' },
    { id: '2', value: 'No' },
  ];
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (this.editableData) {
      this.languageKnownData = this.editableData;
    }
    this.checkStatus();
  }

  public onModalClose = () => {
    this.activeModal.close();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onClickChangeRead = (value: string) => {
    this.languageKnownData.emplanguageRead = value;
  }
  public onClickChangeWrite = (value: string) => {
    this.languageKnownData.emplanguageWrite = value;
  }
  public onClickChangeSpeak = (value: string) => {
    this.languageKnownData.emplanguageSpeak = value;
  }

  public onSaveAddKnownLanguage = (form: NgForm) => {
    if (!this.languageKnownData.emplanguageRead) {
      this.openSnackBar('Select Read!', 'warning');
    } else if (!this.languageKnownData.emplanguageWrite) {
      this.openSnackBar('Select Write!', 'warning');
    } else if (!this.languageKnownData.emplanguageSpeak) {
      this.openSnackBar('Select Write!', 'warning');
    } else {
      this.spinner.show();
      this.languageKnownData.loginemployeeID = this.employeeData.employeeID;
      this.candidateService
        .addEmployeeKnownLanguage(this.languageKnownData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              setTimeout(() => {
                form.resetForm();
                this.spinner.hide();
                this.activeModal.close();
              }, 1000);
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
  }

  public onSaveEditLanguage = (form: NgForm) => {
    if (!this.languageKnownData.emplanguageRead) {
      this.openSnackBar('Select Read!', 'warning');
    } else if (!this.languageKnownData.emplanguageWrite) {
      this.openSnackBar('Select Write!', 'warning');
    } else if (!this.languageKnownData.emplanguageSpeak) {
      this.openSnackBar('Select Write!', 'warning');
    } else {
      this.spinner.show();
      this.languageKnownData.loginemployeeID = this.employeeData.employeeID;
      this.candidateService
        .editEmployeeKnownLanguage(this.languageKnownData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              setTimeout(() => {
                form.resetForm();
                this.spinner.hide();
                this.activeModal.close();
              }, 1000);
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
  }

  public onDeleteLanguage = () => {
    this.spinner.show();
    this.languageKnownData.loginemployeeID = this.employeeData.employeeID;
    this.candidateService
      .deleteEmployeeKnownLanguage(this.languageKnownData)
      .subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.updateData(response[0].data);
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close();
              this.openSnackBar('removed', 'success');
            }, 1000);
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

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
