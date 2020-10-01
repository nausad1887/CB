import { Component, OnInit } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { EducationModalComponent } from '../education-modal/education-modal.component';

@Component({
  selector: 'app-shared-education',
  templateUrl: './shared-education.component.html',
  styleUrls: ['./shared-education.component.css'],
})
export class SharedEducationComponent implements OnInit {
  public educationListsData = [];
  public employeeData: any;
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    public homeService: HomeService,
    private modalService: NgbModal,
    public candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.checkStatus();
    this.listsEducation()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.educationListsData = fulfilled;
          this.educationListsData.sort((a, b) => {
            return a.empeducationID - b.empeducationID;
          });
        } else {
          this.educationListsData = [];
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

  public listsEducation = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.listsEducation(data).subscribe(
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

  public openAddEducationModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      EducationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.ngOnInit();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.addEducation = true;
    modalRef.componentInstance.editEducation = false;
  }

  public openEditEducationModal = (education: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      EducationModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.ngOnInit();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.addEducation = false;
    modalRef.componentInstance.editEducation = true;
    modalRef.componentInstance.editableData = education;
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
