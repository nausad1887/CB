import { Component, OnInit } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { EmploymentModalComponent } from '../employment-modal/employment-modal.component';

@Component({
  selector: 'app-shared-employment',
  templateUrl: './shared-employment.component.html',
  styleUrls: ['./shared-employment.component.css'],
})
export class SharedEmploymentComponent implements OnInit {
  public employeeData: any;
  public employmentLists = [];
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.checkStatus();
    this.listsEmployeeEmployment()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.employmentLists = fulfilled;
          this.employmentLists.sort((a, b) => {
            return a.empworkID - b.empworkID;
          });
        } else {
          this.employmentLists = [];
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

  public listsEmployeeEmployment = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.listsEmployeeEmployment(data).subscribe(
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

  public openAddEmploymentModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      EmploymentModalComponent,
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
    modalRef.componentInstance.addEmployment = true;
    modalRef.componentInstance.editEmployment = false;
  }

  public openEditEmploymentModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      EmploymentModalComponent,
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
    modalRef.componentInstance.addEmployment = false;
    modalRef.componentInstance.editEmployment = true;
    modalRef.componentInstance.editableEmploymentData = data;
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
