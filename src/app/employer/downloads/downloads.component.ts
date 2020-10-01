import { Component, OnInit } from '@angular/core';
import {NgbModalOptions,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { AddDownloadFolderComponent } from '../add-download-folder/add-download-folder.component';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
})
export class DownloadsComponent implements OnInit {
  public closeResult: string;
  public loading = false;
  public noRecordFound = false;
  public downloadsLists = [];
  public employerData: any;
  modalOption: NgbModalOptions = {}; // not null!
  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.getDownloadsLists();
  }

  public trackDownloads = (data: any, index: number) => {
    return data.employerdownloadID;
  }

  public getDownloadsLists = () => {
    const data = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
    };
    this.employerService.listsDownloadsFolder(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.loading = false;
          this.downloadsLists = response[0].data;
          this.downloadsLists.sort((a, b) => {
            return a.employerdownloadID - b.employerdownloadID;
          });
        } else {
          this.loading = false;
          this.noRecordFound = true;
          this.downloadsLists = [];
          console.error(response[0].message);
        }
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  public openEditFolderModal(post: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AddDownloadFolderComponent,
      this.modalOption
    );
    const data = {
      loginemployerID: this.employerData.employerID,
      employerdownloadID: post.employerdownloadID
        ? post.employerdownloadID
        : '',
      employerdownloadName: post.employerdownloadName
        ? post.employerdownloadName
        : '',
    };
    modalRef.componentInstance.post = data;
    modalRef.componentInstance.addFolder = false;
    modalRef.componentInstance.editFolder = true;
    modalRef.result.then(
      (result) => {
        result === 'success'
          ? this.getDownloadsLists()
          : (this.closeResult = result);
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public openAddFolderModal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AddDownloadFolderComponent,
      this.modalOption
    );
    const data = {
      loginemployerID: this.employerData.employerID,
    };
    modalRef.componentInstance.post = data;
    modalRef.componentInstance.addFolder = true;
    modalRef.componentInstance.editFolder = false;
    modalRef.result.then(
      (result) => {
        result === 'success'
          ? this.getDownloadsLists()
          : (this.closeResult = result);
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
