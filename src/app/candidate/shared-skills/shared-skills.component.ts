import { Component, OnInit } from '@angular/core';
import {NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkillModalComponent } from '../skill-modal/skill-modal.component';

@Component({
  selector: 'app-shared-skills',
  templateUrl: './shared-skills.component.html',
  styleUrls: ['./shared-skills.component.css'],
})
export class SharedSkillsComponent implements OnInit {
  public employeeData: any;
  public skillListsData = [];
  public primaryList = [];
  public secondaryList = [];
  public otherList = [];
  public closeResult: string;
  public modalOption: NgbModalOptions = {}; //  not null!
  constructor(
    public homeService: HomeService,
    private modalService: NgbModal,
    public candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkStatus();
    this.listsSkill()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.skillListsData = fulfilled;
          this.primaryList = this.skillListsData.filter(
            (skillType) => skillType.empskillType === 'Primary'
          );
          this.secondaryList = this.skillListsData.filter(
            (skillType) =>
              skillType.empskillType === 'Secondary' ||
              skillType.empskillType === 'secondary'
          );
          this.otherList = this.skillListsData.filter(
            (skillType) => skillType.empskillType === 'Other'
          );
        } else {
          this.skillListsData = [];
          console.error('No Record Found.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
  }

  public listsSkill = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployeeID: this.employeeData.employeeID,
        empskillID: '',
      };
      this.candidateService.listSkills(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            resolve([]);
          }
        },
        (errored) => {
          reject(errored);
        }
      );
    });
  }

  public openPriSkillModal = (primaryList: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(SkillModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {this.ngOnInit(); this.closeResult = `Closed with: ${result}`; },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; });
    modalRef.componentInstance.primarySkills = primaryList;
    modalRef.componentInstance.secondarySkills = [];
    modalRef.componentInstance.otherSkills = [];
    modalRef.componentInstance.primary = true;
    modalRef.componentInstance.secondary = false;
    modalRef.componentInstance.other = false;
  }

  public openSecondaryModal = (secondarySkills: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(SkillModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {this.ngOnInit(); this.closeResult = `Closed with: ${result}`; },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; });
    modalRef.componentInstance.secondarySkills = secondarySkills;
    modalRef.componentInstance.primarySkills = [];
    modalRef.componentInstance.otherSkills = [];
    modalRef.componentInstance.primary = false;
    modalRef.componentInstance.secondary = true;
    modalRef.componentInstance.other = false;
  }

  public openOtherModal = (otherSkills: Array<any>) => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(SkillModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {this.ngOnInit(); this.closeResult = `Closed with: ${result}`; },
      (reason) => {this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; });
    modalRef.componentInstance.otherSkills = otherSkills;
    modalRef.componentInstance.primarySkills = [];
    modalRef.componentInstance.secondarySkills = [];
    modalRef.componentInstance.primary = false;
    modalRef.componentInstance.secondary = false;
    modalRef.componentInstance.other = true;
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

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
