import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from '../candidate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileData } from 'src/app/candidateInterface';

@Component({
  selector: 'app-shared-resume',
  templateUrl: './shared-resume.component.html',
  styleUrls: ['./shared-resume.component.css'],
})
export class SharedResumeComponent implements OnInit {
  public selectedFiles: File;
  public employeeData: any;
  public resumeUrl: string;
  public maxSize = 2048000;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkStatus();
  }

  public checkStatus = () => {
    this.employeeData = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    this.resumeUrl = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeResume}`;
  }

  public updateResume = (fileName: string) => {
    const data = {
      languageID: '1',
      loginemployeeID: this.employeeData.employeeID,
      employeeResume: fileName,
    };
    this.candidateService.updateEmployeeResume(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          this.updateData(response[0].data);
          this.openSnackBar('Updated', 'true');
        } else {
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (errors) => {
        console.error(errors);
      }
    );
  }

  public downloadResume = (url: any) => {
    window.open(url);
  }

  public uploadFiles = (file: File) => {
    return new Promise((resolve, reject) => {
      const data: UploadFileData = {
        file,
        fileName: file.name,
        filePath: this.employeeData.employeeID,
        loginemployeeID: this.employeeData.employeeID,
      };
      this.candidateService.uploadFile(data).subscribe((response) => {
        if (response[0].status === 'true') {
          resolve(response);
        } else {
          reject(response);
          this.openSnackBar(response[0].message, 'error');
        }
      });
    });
  }

  public uploadResume = async (event: any) => {
    if (event.target.files.length > 0) {
      if (event.target.files[0].size <= this.maxSize) {
        this.selectedFiles = event.target.files[0] as File;
        await this.uploadFiles(this.selectedFiles)
          .then((fulfilled) => {
            this.updateResume(fulfilled[0].fileName);
          })
          .catch((errors) => {
            console.error(errors);
          });
      } else {
        this.openSnackBar('File size Should not be more than 2 MB', 'false');
      }
    }
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
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
