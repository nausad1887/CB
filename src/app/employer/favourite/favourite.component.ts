import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import {NgbModalOptions,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AddFolderModalComponent } from '../add-folder-modal/add-folder-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
})
export class FavouriteComponent implements OnInit {
  public closeResult: string;
  public loading = false;
  public noRecordFound = false;
  public favouritesLists = [];
  public employerData: any;
  modalOption: NgbModalOptions = {}; // not null!
  constructor(
    public employerService: EmployerService,
    public homeService: HomeService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.getFavouritesLists();
  }

  public trackFavouritres = (data: any, index: number) => {
    return data.employerfavoriteID;
  }

  public getFavouritesLists = () => {
    const data = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
    };
    this.employerService.listsFavouritesFolder(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.loading = false;
          this.favouritesLists = response[0].data;
          this.favouritesLists.sort((a, b) => {
            return a.employerfavoriteID - b.employerfavoriteID;
          });
        } else {
          this.loading = false;
          this.noRecordFound = true;
          this.favouritesLists = [];
          console.error(response[0].message);
        }
      },
      (error) => {
        this.loading = false;
        console.error(error);
      }
    );
  }

  public onRemoveFolder = (post: any) => {
    this.spinner.show();
    post.loginemployerID = this.employerData.employerID;
    post.languageID = '1';
    this.employerService.deleteFavouriteFolder(post).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          setTimeout(() => {
            this.spinner.hide();
            this.getFavouritesLists();
          }, 500);
        } else {
          console.error(response[0].message);
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public openEditFolderModal(post: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AddFolderModalComponent,
      this.modalOption
    );
    const data = {
      loginemployerID: this.employerData.employerID,
      employerfavoriteID: post.employerfavoriteID
        ? post.employerfavoriteID
        : '',
      employerfavoriteName: post.employerfavoriteName
        ? post.employerfavoriteName
        : '',
    };
    modalRef.componentInstance.post = data;
    modalRef.componentInstance.addFolder = false;
    modalRef.componentInstance.editFolder = true;
    modalRef.result.then(
      (result) => {
        result === 'success'
          ? this.getFavouritesLists()
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
      AddFolderModalComponent,
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
          ? this.getFavouritesLists()
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
