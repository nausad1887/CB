import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public languageList = [];
  public closeResult: string;
  modalOption: NgbModalOptions = {}; // not null!

  constructor(
    private candidateService: HomeService,
    public router: Router,
    private modalService: NgbModal,
    public toastr: ToastrManager
  ) {}

  ngOnInit(): void {
    this.getLanguageList();
  }

  public getLanguageList: any = () => {
    return this.candidateService.getLanguageList().subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.languageList = response[0].data;
        } else {
          this.toastr.errorToastr(response[0].message);
        }
      },
      // tslint:disable-next-line:no-shadowed-variable
      (error) => {
        this.toastr.errorToastr(error);
      }
    );
  }; // end of getLanguageList

  // update language
  public onChangeLanguage(value: any): void {
    // event will give you full breif of action
    const newVal = value;
    if (newVal === null || newVal === undefined || newVal === '') {
      const selectedLanguage = 1;
      this.candidateService.nextLanguageID(selectedLanguage);
    } else {
      this.candidateService.nextLanguageID(newVal);
    }
  }

  public openLoginModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      LoginModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        // this.checkStatus();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.isCandidateLogin = true;
    modalRef.componentInstance.isEmployeeLogin = false;
  };

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
