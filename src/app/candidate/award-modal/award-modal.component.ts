import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HomeService } from 'src/app/home.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-award-modal',
  templateUrl: './award-modal.component.html',
  styleUrls: ['./award-modal.component.css'],
})
export class AwardModalComponent implements OnInit {
  @Input() addAward: boolean;
  @Input() editAward: boolean;
  @Input() editableData: any;
  public employeeData: any;
  public addAwardData = {
    loginemployeeID: '',
    empawardName: '',
    empawardIssuedBy: '',
    empaward: '',
  };
  constructor(
    public candidateService: CandidateService,
    public activeModal: NgbActiveModal,
    public toastr: ToastrManager,
    public homeService: HomeService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (this.editableData) {
      this.addAwardData.empawardName = this.editableData.empawardName;
      this.addAwardData.empawardIssuedBy = this.editableData.empawardIssuedBy;
      this.addAwardData.empaward = this.editableData.empaward;
      this.addAwardData.loginemployeeID = this.editableData.employeeID;
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

  public onSaveAward = (form: NgForm) => {
    this.spinner.show();
    this.addAwardData.loginemployeeID = this.employeeData.employeeID;
    this.candidateService.addEmployeeAward(this.addAwardData).subscribe(
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

  public onEditSubmit = (editform: NgForm) => {
    this.spinner.show();
    this.candidateService.editEmployeeAward(this.addAwardData).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          setTimeout(() => {
            editform.resetForm();
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

  public onDeleteAward = (empaward: string) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      empaward,
    };
    this.candidateService.deleteEmployeeAward(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          setTimeout(() => {
            this.toastr.successToastr('Removed');
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

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
