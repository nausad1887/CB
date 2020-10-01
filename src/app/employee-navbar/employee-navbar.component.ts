import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { EmployerService } from '../employer/employer.service';

@Component({
  selector: 'app-employee-navbar',
  templateUrl: './employee-navbar.component.html',
  styleUrls: ['./employee-navbar.component.css'],
})
export class EmployeeNavbarComponent implements OnInit {
  public employerData: any;
  public url: string;
  public baseUrl =
    'http://betaapplication.com/candidatebazar/backend/web/uploads';
  constructor(
    public homeService: HomeService,
    public employerService: EmployerService
  ) {}

  ngOnInit(): void {
    this.userData();
    this.updateUser();
  }
  public userData = () => {
    this.url = '';
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.url = `${this.baseUrl}/${this.employerData.employerID}/${this.employerData.employerLogo}`;
  }
  public updateUser = () => {
    this.employerService.updateUserNavbar.subscribe((user) => {
      user ? this.userData() : (user = '');
    });
  }
  public signOut = () => {
    // remove user data from local storage for log out
    if (this.homeService.getCurrentEmployerFromLocalStorage()) {
      this.homeService.removeEmployerLocalStorage();
      this.homeService.isEmployerTrue(false);
    } else {
      this.homeService.removeEmployerSessionStorage();
      this.homeService.isEmployerTrue(false);
    }
  }
}
