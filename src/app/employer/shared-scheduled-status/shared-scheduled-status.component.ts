import { Component, OnInit, Input } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { SaveFolderModalComponent } from '../save-folder-modal/save-folder-modal.component';
import { DownloadComponent } from '../download/download.component';
import { HomeService } from 'src/app/home.service';
import { ScheduleInterviewModalComponent } from '../schedule-interview-modal/schedule-interview-modal.component';

@Component({
  selector: 'app-shared-scheduled-status',
  templateUrl: './shared-scheduled-status.component.html',
  styleUrls: ['./shared-scheduled-status.component.css'],
})
export class SharedScheduledStatusComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() jobJdID: string;
  public employerData: any;
  modalOption: NgbModalOptions = {}; // not null!
  public closeResult: string;
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
  }

  public openSaveFolderModal = (arr: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      SaveFolderModalComponent,
      this.modalOption
    );
    const data = {
      employerID: this.employerData.employerID,
      employeeID: arr.toString(),
      jobjdID: this.jobJdID,
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public openAddFavouriteModal = (arr: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      SaveFolderModalComponent,
      this.modalOption
    );
    const data = {
      employerID: this.employerData.employerID,
      employeeID: arr.toString(),
      jobjdID: this.jobJdID,
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public openDownloadFolderModal = (arr: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      DownloadComponent,
      this.modalOption
    );
    const data = {
      employerID: this.employerData.employerID,
      employeeID: arr.toString(),
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  public scheduleInterviewModal = (arr: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      ScheduleInterviewModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.employeeID = arr.toString();
    modalRef.result.then(
      (result) => {
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
}
