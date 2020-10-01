import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger } from '@angular/animations';
import { fadeIn } from '../subscrptions-skeleton/animation';
import { AddFolderModalComponent } from '../add-folder-modal/add-folder-modal.component';

@Component({
  selector: 'app-save-folder-modal',
  templateUrl: './save-folder-modal.component.html',
  styleUrls: ['./save-folder-modal.component.css'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SaveFolderModalComponent implements OnInit {
  @Input() data: any;
  public closeResult: string;
  public loading = false;
  public noRecordFound = false;
  public favouritesLists = [];
  saveFolderForm: FormGroup;
  modalOption: NgbModalOptions = {}; // not null!
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public employerService: EmployerService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {
    this.saveFolderForm = fb.group({
      formRadio: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.getPromise();
  }

  onClose() {
    this.activeModal.close();
  }

  public getPromise = () => {
    this.getFavouritesLists()
      .then((fulfilled: Array<any>) => {
        this.loading = false;
        this.favouritesLists = fulfilled;
        this.favouritesLists.sort((a, b) => {
          return a.employerfavoriteID - b.employerfavoriteID;
        });
      })
      .catch((error) => {
        if (error === 'No Record Found.') {
          this.loading = false;
          this.noRecordFound = true;
          this.favouritesLists = [];
          console.error(error);
        } else {
          this.loading = false;
          console.error(error);
        }
      });
  }

  public onSubmitSave = (post: any) => {
    if (this.saveFolderForm.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.data.employerID,
        employerfavoriteID: post.formRadio,
        employeeID: this.data.employeeID,
        jobjdID: this.data.jobjdID ? this.data.jobjdID : '0',
      };
      this.employerService.employeeAddEditFavourite(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.activeModal.close();
              this.spinner.hide();
              this.openSnackBar('saved', 'success');
            }, 1000);
          } else {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public getFavouritesLists = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.data.employerID,
      };
      this.employerService.listsFavouritesFolder(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
          } else {
            reject('No Record Found.');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  public openAddFolderModal = () => {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AddFolderModalComponent,
      this.modalOption
    );
    const data = {
      loginemployerID: this.data.employerID,
    };
    modalRef.componentInstance.post = data;
    modalRef.componentInstance.addFolder = true;
    modalRef.componentInstance.editFolder = false;
    modalRef.result.then(
      (result) => {
        result === 'success' ? this.getPromise() : (this.closeResult = result);
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
