import { Component, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { WorkprofileModalComponent } from '../workprofile-modal/workprofile-modal.component';

@Component({
  selector: 'app-shared-work-profile',
  templateUrl: './shared-work-profile.component.html',
  styleUrls: ['./shared-work-profile.component.css'],
})
export class SharedWorkProfileComponent implements OnInit, DoCheck {
  public employeeData: any;
  public workProfileLists = [];
  public closeResult: string;
  public differ: any;
  public change: any;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    private modalService: NgbModal,
    public homeService: HomeService,
    public candidateService: CandidateService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit(): void {
    this.getUpdateFromComponents();
    this.checkStatus();
    this.getLists();
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
  }

  public getLists = () => {
    this.listsWorkProfile()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.workProfileLists = fulfilled;
          this.workProfileLists.sort((a, b) => {
            return a.empworkprofileID - b.empworkprofileID;
          });
        } else {
          this.workProfileLists = [];
          console.error('No Record Found.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public listsWorkProfile = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
        empskillID: '',
      };
      this.candidateService.listsWorkProfile(data).subscribe(
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

  public openAddWorkProfileModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      WorkprofileModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.getLists();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.addWorkProfile = true;
    modalRef.componentInstance.editWorkProfile = false;
  }

  public openEditWorkProfile = (workprofileData: any) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      WorkprofileModalComponent,
      this.modalOption
    );
    modalRef.result.then(
      (result) => {
        this.getLists();
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.componentInstance.addWorkProfile = false;
    modalRef.componentInstance.editWorkProfile = true;
    modalRef.componentInstance.editableData = workprofileData;
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

  public getUpdateFromComponents = () => {
    this.candidateService.updateAllComponenet.subscribe(
      (response) => (this.change = response ? response : '')
    );
  }

  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'change') {
          this.getLists();
        }
      });
    }
  }
}
