import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { AwardModalComponent } from '../award-modal/award-modal.component';

@Component({
  selector: 'app-shared-awards',
  templateUrl: './shared-awards.component.html',
  styleUrls: ['./shared-awards.component.css'],
})
export class SharedAwardsComponent implements OnInit {
  public awardLists = [];
  public employeeData: any;
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService
  ) { }

  ngOnInit(): void {
    this.checkStatus();
    this.listsAwards()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.awardLists = fulfilled;
          this.awardLists.sort((a, b) => {
            return a.empaward - b.empaward;
          });
        } else {
          this.awardLists = [];
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

  public listsAwards = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.listsEmployeeAward(data).subscribe(
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

  public openAddAwardModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AwardModalComponent,
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
    modalRef.componentInstance.addAward = true;
    modalRef.componentInstance.editAward = false;
  }

  public openEditAwardModal = (data: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AwardModalComponent,
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
    modalRef.componentInstance.addAward = false;
    modalRef.componentInstance.editAward = true;
    modalRef.componentInstance.editableData = data;
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
