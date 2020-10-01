import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css'],
})
export class TermsAndConditionsComponent implements OnInit {
  public cmsData = [];
  public cmsContent: string;
  public cmsName: string;
  private cmsPageData = {
    loginuserID: '',
    languageID: '1',
    cmspageName: 'Terms And Conditions',
  };
  constructor(
    public candidateService: HomeService,
    public toastr: ToastrManager,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCmsPage();
  }

  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public getCmsPage = () => {
    const data = {
      loginuserID: this.cmsPageData.loginuserID,
      languageID: this.cmsPageData.languageID,
      cmspageName: this.cmsPageData.cmspageName,
    };
    this.candidateService.getCmsPage(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.cmsData = response[0].data;
          this.cmsName = response[0].data[0].cmspageName;
          this.cmsContent = response[0].data[0].cmspageContents;
        } else {
          this.openSnackBar(response[0].message, 'error');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };
}
