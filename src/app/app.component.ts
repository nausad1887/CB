import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public isHome = false;
  public isCandidate = false;
  public isEmployee = false;
  title = 'app';
  constructor(
    public homeService: HomeService,
    public router: Router,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.spinner.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.spinner.hide();
        this.modalService.dismissAll();
      }
    });
    this.candidateTrue();
    this.employerTrue();
  }
  public candidateTrue = () => {
    this.homeService.update.subscribe((data) => {
      if (data === undefined || data === null || data === false) {
        this.checkStatus();
      } else {
        this.isHome = false;
        this.isCandidate = true;
        this.isEmployee = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  public employerTrue = () => {
    this.homeService.updateEmployer.subscribe((data) => {
      if (data === undefined || data === null || data === false) {
        this.checkStatus();
      } else {
        this.isHome = false;
        this.isCandidate = false;
        this.isEmployee = true;
        this.router.navigate(['/employer-dashboard']);
      }
    });
  }

  public checkStatus = () => {
    if (
      this.homeService.getCurrentUserFromLocalStorage() ||
      this.homeService.getCurrentUserFromSessionStorage()
    ) {
      this.isHome = false;
      this.isCandidate = true;
      this.isEmployee = false;
      this.router.navigate(['/dashboard']);
    } else if (
      this.homeService.getCurrentEmployerFromLocalStorage() ||
      this.homeService.getCurrentEmployerFromSessionStorage()
    ) {
      this.isHome = false;
      this.isCandidate = false;
      this.isEmployee = true;
      this.router.navigate(['/employer-dashboard']);
    } else {
      this.isHome = true;
      this.isCandidate = false;
      this.isEmployee = false;
      this.router.navigate(['/home']);
    }
  }

  public onActivate(event: any) {
    window.scroll(0, 0);
  }
}
