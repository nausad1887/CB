import { Component, OnInit } from '@angular/core';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import {
  NgbModalOptions,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public closeResult: string;
  public employerData: any;
  public url: string;
  public maxSize = 2048000;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  modalOption: NgbModalOptions = {}; // not null!
  public selectedFiles: File;
  constructor(
    private modalService: NgbModal,
    public employerService: EmployerService,
    public homeService: HomeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.url = `${this.baseUrl}/${this.employerData.employerID}/${this.employerData.employerLogo}`;
  }

  public openEditPostJDmodal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = true;
    const modalRef = this.modalService.open(
      EditProfileModalComponent,
      this.modalOption
    );
    modalRef.componentInstance.editableData = this.employerData;
    modalRef.result.then(
      (result) => {
        result === 'success' ? this.ngOnInit() : (this.closeResult = result);
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

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  public async onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size <= this.maxSize) {
        this.selectedFiles = event.target.files[0] as File;
        await this.uploadFiles(this.selectedFiles)
          .then((fulFilled) => {
            this.updateLogo(fulFilled[0].fileName);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.openSnackBar('File size Should not be more than 2 MB', 'false');
      }
    }
  }

  public uploadFiles = (file: File) => {
    return new Promise((resolve, reject) => {
      const data = {
        file,
        fileName: file.name,
        filePath: this.employerData.employerID,
        loginemployerID: this.employerData.employerID,
      };
      this.employerService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response);
        } else {
          reject(response[0].message);
          this.openSnackBar(response[0].message, 'error');
        }
      });
    });
  }; //  end of uploadFiles

  public updateLogo(employerLogo: string) {
    const data = {
      languageID: '1',
      loginemployerID: this.employerData.employerID,
      employerLogo,
    };
    this.employerService.employerUpdateLogo(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.employerData = response[0].data;
          this.homeService.getCurrentEmployerFromLocalStorage()
            ? this.homeService.setCurrentEmployerInLocalStorage(
                response[0].data
              )
            : this.homeService.setCurrentEmployerInSessionStorage(
                response[0].data
              );
          this.url = `${this.baseUrl}/${this.employerData.employerID}/${response[0].data[0].employerLogo}`;
          this.openSnackBar('Employer Logo Updated', 'success');
          setTimeout(() => {
            this.employerService.updateUserNav(response[0].data);
          });
        } else {
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
