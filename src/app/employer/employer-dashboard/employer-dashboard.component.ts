import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { EmployerService } from '../employer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employer-dashboard',
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.css'],
})
export class EmployerDashboardComponent implements OnInit, OnDestroy {
  public employerData: any;
  public skillsLists = [];
  public todaysInterviews = [];
  public url: string;
  public loading = false;
  public noRecordFound = false;
  public baseUrl = 'http://betaapplication.com/candidatebazar/backend/web/uploads';
  subscription: Subscription;
  constructor(
    public homeService: HomeService,
    public candidateService: CandidateService,
    private router: ActivatedRoute,
    private employerService: EmployerService
  ) {
    this.skillsLists = this.router.snapshot.data.skills[0].data;
    this.skillsLists.sort((a, b) => a.skillID - b.skillID );
    this.skillsLists = this.skillsLists.filter((skill) => skill.skillName);
  }

  ngOnInit(): void {
    this.loading = true;
    // Chart
    $(() => {
      ($('#doughnutChart') as any).drawDoughnutChart([
        { title: 'Selected', value: 300, color: '#98d32f' },
        { title: 'Rejected', value: 50, color: '#f53f3f' },
        { title: 'Hired', value: 550, color: '#4275f7' },
        { title: 'Job Declined', value: 100, color: '#f3a11f' },
        { title: 'Interviewed', value: 100, color: '#42487' },
      ]);
    });
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.url = `${this.baseUrl}/${this.employerData.employerID}/${this.employerData.employerLogo}`;
    this.getTodaysInterviews()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.todaysInterviews = fulfilled;
          this.loading = false;
        } else {
          this.todaysInterviews = [];
          this.loading = false;
          this.noRecordFound = true;
        }
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
  }

  public getTodaysInterviews = () => {
    return new Promise((resolve, reject) => {
      const data = {
        loginemployerID: this.employerData.employerID,
        languageID: '1',
      };
      this.subscription = this.employerService.getEmployerHome(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].todayinterview);
          } else {
            resolve([]);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  public todaysTrackBy = (interview: any, index: any) => {
    return interview.interviewID;
  }

  ngOnDestroy(): void {
    if (this.subscription){this.subscription.unsubscribe(); }
  }
}
