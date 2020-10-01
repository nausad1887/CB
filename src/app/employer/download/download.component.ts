import { Component, OnInit, Input } from '@angular/core';
import { AddDownloadFolderComponent } from '../add-download-folder/add-download-folder.component';
import {ModalDismissReasons, NgbModalOptions, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployerService } from '../employer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  @Input() data: any;
  public closeResult: string;
  public loading = false;
  public noRecordFound = false;
  public downloadsLists = [];
  downloadFolderForm: FormGroup;
  modalOption: NgbModalOptions = {}; // not null!
  constructor(
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public employerService: EmployerService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {
    this.downloadFolderForm = fb.group({
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

  public trackDownloads = (data: any, index: number) => {
    return data.employerdownloadID;
  }

  public getPromise = () => {
    this.getDownloadsLists()
      .then((fulfilled: Array<any>) => {
        this.loading = false;
        this.downloadsLists = fulfilled;
        this.downloadsLists.sort((a, b) => {
          return a.employerdownloadID - b.employerdownloadID;
        });
      })
      .catch((error) => {
        if (error === 'No Record Found.') {
          this.loading = false;
          this.noRecordFound = true;
          this.downloadsLists = [];
          console.error(error);
        } else {
          this.loading = false;
          console.error(error);
        }
      });
  }

  public onSubmitSave = (post: any) => {
    if (this.downloadFolderForm.valid) {
      this.spinner.show();
      const data = {
        languageID: '1',
        loginemployerID: this.data.employerID,
        employerdownloadID: post.formRadio,
        employeeID: this.data.employeeID,
      };
      this.employerService.employeeAddEditDownload(data).subscribe(
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

  public getDownloadsLists = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.data.employerID,
      };
      this.employerService.listsDownloadsFolder(data).subscribe(
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

  public openAddFolderModal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      AddDownloadFolderComponent,
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
