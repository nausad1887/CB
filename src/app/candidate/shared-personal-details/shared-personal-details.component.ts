import { Component, OnInit } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddlanguageKnownModalComponent } from '../addlanguage-known-modal/addlanguage-known-modal.component';
import { UpdateProfileModalComponent } from '../update-profile-modal/update-profile-modal.component';

@Component({
  selector: 'app-shared-personal-details',
  templateUrl: './shared-personal-details.component.html',
  styleUrls: ['./shared-personal-details.component.css'],
})
export class SharedPersonalDetailsComponent implements OnInit {
  public closeResult: string;
  public employeeData: any;
  public knownLanguageLists = [];
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService,
    public toastr: ToastrManager
  ) {}

  ngOnInit(): void {
    this.checkStatus();
    this.listsKnownLanguages()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.knownLanguageLists = fulfilled;
          this.knownLanguageLists.sort((a, b) => {
            return a.employeeID - b.employeeID;
          });
        } else {
          this.knownLanguageLists = [];
          console.error('No Record Found.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
  }

  public listsKnownLanguages = () => {
    return new Promise((resolve, reject) => {
      const data = {loginemployeeID: this.employeeData.employeeID};
      this.candidateService.listsEmployeeKnownLanguage(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  }

  public openAddKnownLanguageModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(AddlanguageKnownModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {
        this.ngOnInit();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.addLanguage = true;
    modalRef.componentInstance.editLanguage = false;
  }

  public openEditKnownLanguageModal = (language: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(AddlanguageKnownModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {
        this.ngOnInit();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.addLanguage = false;
    modalRef.componentInstance.editLanguage = true;
    modalRef.componentInstance.editableData = language;
  }

  public openAddEditPersonalDetailsModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(UpdateProfileModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {
        this.checkStatus();
        this.closeResult = result;
        setTimeout(() => {this.candidateService.updateCurrentCandidate(this.closeResult);
        }, 500);
      },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
    modalRef.componentInstance.employeeDetails = this.employeeData;
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
}
