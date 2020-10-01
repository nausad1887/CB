import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostJdModalComponent } from '../post-jd-modal/post-jd-modal.component';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EditPostJdModalComponent } from '../edit-post-jd-modal/edit-post-jd-modal.component';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewJdComponent } from '../view-jd/view-jd.component';

@Component({
  selector: 'app-post-jd',
  templateUrl: './post-jd.component.html',
  styleUrls: ['./post-jd.component.css'],
})
export class PostJdComponent implements OnInit, OnDestroy {
  public closeResult: string;
  public loading = false;
  public noRecordFoundActive = false;
  public noRecordFoundInActive = false;
  public noRecordFound = false;
  public jobJDlist = [];
  public jobJDlistActive = [];
  public jobJDlistInactive = [];
  public employerData: any;
  public modalOption: NgbModalOptions = {}; // not null!
  private subcription: Subscription;
  constructor(
    private modalService: NgbModal,
    public employerService: EmployerService,
    public homeService: HomeService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.getJDs();
  }

  public getJDs = async () => {
    await this.getJobJDlist().then((success: Array<any>) => {
      if (success.length > 0) {
        this.jobJDlist = success;
        this.getActiveJDs(this.jobJDlist);
        this.getInActiveJDs(this.jobJDlist);
        this.loading = false;
      } else {
        this.jobJDlist = [];
        this.loading = false;
        this.noRecordFound = true;
      }
    }).catch((error) => {
      this.loading = false;
      console.error(error);
    });
  }

  public openAddPostJDmodal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(PostJdModalComponent, this.modalOption);
    modalRef.result.then(
      (result) => {
        if (result === 'success') { this.getJDs(); }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openViewJDmodal(jobJD: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(ViewJdComponent, this.modalOption);
    modalRef.componentInstance.jobJD = jobJD;
    modalRef.result.then(
      (result) => {this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }
  public openEditPostJDmodal(jobJD: any) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(EditPostJdModalComponent, this.modalOption);
    modalRef.componentInstance.jobJD = jobJD;
    modalRef.result.then(
      (result) => {if (result === 'edit-success') { this.getJDs(); }
                   this.closeResult = `Closed with: ${result}`;
      },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
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
  public getJobJDlist = () => {
    return new Promise((resolve, reject) => {
      this.loading = true;
      const data = {languageID: '1', loginemployerID: this.employerData.employerID};
      this.subcription = this.employerService.listJobJd(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {resolve([]); }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getActiveJDs = (jobJDlist: Array<any>) => {
    this.jobJDlistActive = jobJDlist.filter((jobJD) => jobJD.jobjdStatus === 'Active');
    this.jobJDlistActive.length === 0 ? (this.noRecordFoundActive = true) : (this.noRecordFoundActive = false);
  }
  public getInActiveJDs = (jobJDlist: Array<any>) => {
    this.jobJDlistInactive = jobJDlist.filter((jobJD) => jobJD.jobjdStatus === 'Inactive');
    this.jobJDlistInactive.length === 0 ? (this.noRecordFoundInActive = true) : (this.noRecordFoundInActive = false);
  }

  public deactivateJobJD = (jobjdID: string, jobjdStatus: string) => {
    const data = {languageID: '1', loginemployerID: this.employerData.employerID, jobjdID, jobjdStatus};
    this.deactivateJD(data).then((success: string) => {
      if (success === 'Done') {
        setTimeout(() => { this.getJDs(); }, 1000);
      } else {
        console.error(success);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  public deactivateJD = (post: any) => {
    return new Promise((resolve, reject) => {
      this.employerService.deactivateJobJd(post).subscribe(
        (response) => {
          if (response[0].status === 'true') { resolve('Done'); }
          else { resolve('something went wrong'); }
        },
        (error) => { reject(error); });
    });
  }

  // navigating to job-jd-details-page
  public navigateJobJDdetailsPage = (data: any) => {
    sessionStorage.setItem('jobjdINFO', JSON.stringify(data));
    this.router.navigate(['/post-jd/post-jd-details'], {state: {data}});
  }

  ngOnDestroy(): void {
    if (this.subcription){this.subcription.unsubscribe(); }
  }
}
