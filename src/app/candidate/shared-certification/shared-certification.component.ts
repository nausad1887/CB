import { Component, OnInit } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { CirtificateModalComponent } from '../cirtificate-modal/cirtificate-modal.component';

@Component({
  selector: 'app-shared-certification',
  templateUrl: './shared-certification.component.html',
  styleUrls: ['./shared-certification.component.css'],
})
export class SharedCertificationComponent implements OnInit {
  public employeeData: any;
  public certificateLists = [];
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.checkStatus();
    this.listsCertificate()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.certificateLists = fulfilled;
          this.certificateLists.sort((a, b) => {
            return a.empcertificateID - b.empcertificateID;
          });
        } else {
          this.certificateLists = [];
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

  public openAddCertificateModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      CirtificateModalComponent,
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
    modalRef.componentInstance.addCertificate = true;
    modalRef.componentInstance.editCertificate = false;
  }

  public openEditCertificateModal = (certificate: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      CirtificateModalComponent,
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
    modalRef.componentInstance.addCertificate = false;
    modalRef.componentInstance.editCertificate = true;
    modalRef.componentInstance.editableData = certificate;
  }

  public listsCertificate = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.listsEmployeeCertificate(data).subscribe(
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
