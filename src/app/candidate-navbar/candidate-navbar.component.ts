import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';
import { CandidateService } from '../candidate/candidate.service';

@Component({
  selector: 'app-candidate-navbar',
  templateUrl: './candidate-navbar.component.html',
  styleUrls: ['./candidate-navbar.component.css'],
})
export class CandidateNavbarComponent implements OnInit {
  public languageList = [];
  public employeeName: string;
  public employeeData: any;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public url: string;
  constructor(
    public router: Router,
    public homeService: HomeService,
    public candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.updateEmployee();
    this.getLanguageList();
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
      this.employeeName = this.employeeData.employeeName;
      this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
      this.employeeName = this.employeeData.employeeName;
      this.url = `${this.baseUrl}/${this.employeeData.employeeID}/${this.employeeData.employeeProfilePicture}`;
    }
  }

  public updateEmployee = () => {
    this.candidateService.updateData.subscribe((response) => {
      response ? this.checkStatus() : this.checkStatus();
    });
  }

  public getLanguageList: any = () => {
    return this.homeService.getLanguageList().subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.languageList = response[0].data;
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  } // end of getLanguageList

  // update language
  public onChangeLanguage(value: any): void {
    // event will give you full breif of action
    const newVal = value;
    if (newVal === null || newVal === undefined || newVal === '') {
      const selectedLanguage = 1;
      this.homeService.nextLanguageID(selectedLanguage);
    } else {
      this.homeService.nextLanguageID(newVal);
    }
  }
  public signOut = () => {
    // remove user data from local storage for log out
    if (this.homeService.getCurrentUserFromLocalStorage()) {
      this.homeService.removeLocalStorage();
      this.homeService.isCandidateTrue(false);
    } else {
      this.homeService.removeSessionStorage();
      this.homeService.isCandidateTrue(false);
    }
  }
}
