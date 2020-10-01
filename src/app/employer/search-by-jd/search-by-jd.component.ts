import { Component, OnInit, KeyValueDiffers, OnDestroy } from '@angular/core';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { SearchJDdata } from 'src/app/candidateInterface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-by-jd',
  templateUrl: './search-by-jd.component.html',
  styleUrls: ['./search-by-jd.component.css'],
})
export class SearchByJdComponent implements OnInit, OnDestroy {
  private employerData: any;
  public jobJDlist = [];
  public data = [];
  public searchText: string;
  public loadingJDlist = true;
  public noRecordFoundJDlist = false;
  public noRecordFound = false;
  public emptyData = true;
  public loading = false;
  public noRecordFoundWithFilter = false;
  public loadingWithFilter = false;
  public searched = false;
  public pageSize = 4;
  public page = 1;
  public show = 6;
  public differ: any;
  private subcription: Subscription;
  public searchJDdata: SearchJDdata = {
    languageID: '1',
    loginemployerID: '',
    skillIDs: '',
    empworkDesignation: '',
    jobjdName: '',
    cityID: '0',
    minval: '1',
    maxval: '500000',
    expMinVal: '0',
    expMaxVal: '5',
    empcertificateName: '',
    noticeID: '',
    emplanguageName: '',
    empkycExpYear: '',
    degreeID: '',
    industryIDs: '',
    noticeIDs: '',
    regionIDs: '',
    countryIDs: '',
    cityIDs: '',
    avialablefromIDs: '',
    emplanguageNames: '',
    degreeIDs: '',
    cvduration: '',
  };
  constructor(
    public employerService: EmployerService,
    private homeService: HomeService,
    private differs: KeyValueDiffers,
    private spinner: NgxSpinnerService,
    public config: NgbPaginationConfig
  ) {
    // customize default values of paginations used by this component tree
    config.size = 'sm';
    config.boundaryLinks = true;
    this.differ = this.differs.find({}).create();
  }
  ngOnInit() {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.synchronous();
  }

  public changeSkill = ($event: any) => {
    this.getJd($event);
  }
  public changeIndustry = ($event: any) => {
    this.getJd($event);
  }
  public changeCity = ($event: any) => {
    this.getJd($event);
  }
  public changeDegree = ($event: any) => {
    this.getJd($event);
  }
  public changeNotice = ($event: any) => {
    this.getJd($event);
  }
  public changeAvailable = ($event: any) => {
    this.getJd($event);
  }
  public changeCountry = ($event: any) => {
    this.getJd($event);
  }
  public changeCLanguage = ($event: any) => {
    this.getJd($event);
  }
  public changeSallary = ($event: any) => {
    this.getJd($event);
  }
  public changeExperiance = ($event: any) => {
    this.getJd($event);
  }
  public searchOnJobRole = ($event: any) => {
    // console.log($event);
  }

  public synchronous = async () => {
    await this.getJobJDlist()
      .then((fulfilled: Array<any>) => {
        if (fulfilled.length > 0) {
          this.jobJDlist = fulfilled;
          this.loadingJDlist = false;
          this.getActiveJDs(this.jobJDlist);
        } else {
          this.loadingJDlist = false;
          this.noRecordFoundJDlist = true;
        }
      })
      .catch((error) => {
        this.loadingJDlist = false;
        console.error(error);
      });
  }

  public getActiveJDs = (jobJDlist: Array<any>) => {
    this.jobJDlist = jobJDlist.filter((jd) => jd.jobjdStatus === 'Active');
    this.jobJDlist.length === 0
      ? (this.noRecordFoundJDlist = true)
      : (this.noRecordFoundJDlist = false);
  }

  public getJobJDlist = () => {
    return new Promise((resolve, reject) => {
      const data = {
        languageID: '1',
        loginemployerID: this.employerData.employerID,
      };
      this.subcription = this.employerService.listJobJd(data).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            resolve(response[0].data);
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

  public jobJDdetails = (job: any) => {
    this.searchText = job.jobjdName ? job.jobjdName : '';
    this.searchJDdata.cityID = job.cityID ? job.cityID : '0';
    this.searchJDdata.degreeID = job.degreeID ? job.degreeID : '';
    this.searchJDdata.empcertificateName = job.jobjdCertificatation
      ? job.jobjdCertificatation
      : '';
    this.searchJDdata.noticeID = job.noticeID ? job.noticeID : '';
    this.searchJDdata.minval = job.salaryrangeID ? job.salaryrangeID : '';
    this.searchJDdata.empworkDesignation = job.jobjdName ? job.jobjdName : '';
    const skills =
      job.jdskills.length > 0
        ? job.jdskills.map((skill: { skillID: string }) => skill.skillID)
        : '';
    this.searchJDdata.skillIDs = skills.length > 0 ? skills.toString() : '';
    this.searchJDdata.empkycExpYear = job.jobjdexperiance
      ? job.jobjdexperiance
      : '';
    this.searchJd(this.searchJDdata);
  }

  public searchJd = ($event: any) => {
    this.emptyData = false;
    this.noRecordFound = false;
    this.loading = true;
    this.spinner.show();
    this.data = [];
    const post = $event;
    post.loginemployerID = this.employerData.employerID;
    this.employerService.searchJD(post).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.loading = false;
          this.searched = true;
          this.data = response[0].data;
          const data = {
            cityID: post.cityID ? post.cityID : '0',
            languageName: post.emplanguageName ? post.emplanguageName : '',
            noticeID: post.noticeID ? post.noticeID : '',
            expYr: post.empkycExpYear ? post.empkycExpYear : '',
            empcertificateName: post.empcertificateName
              ? post.empcertificateName
              : '',
            empworkDesignation: post.empworkDesignation
              ? post.empworkDesignation
              : '',
            skills: post.skillIDs.split(', '),
          };
          this.employerService.updateFilterData(data);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.searched = false;
          this.noRecordFound = true;
          this.loading = false;
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public getJd = (post: any) => {
    this.emptyData = false;
    this.noRecordFound = false;
    this.noRecordFoundWithFilter = false;
    this.loading = false;
    this.loadingWithFilter = true;
    this.spinner.show();
    this.data = [];
    post.loginemployerID = this.employerData.employerID;
    this.employerService.searchJD(post).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.emptyData = false;
          this.loading = false;
          this.loadingWithFilter = false;
          this.data = response[0].data;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.searched = true;
          this.noRecordFound = false;
          this.noRecordFoundWithFilter = true;
          this.loadingWithFilter = false;
          this.loading = false;
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subcription){this.subcription.unsubscribe(); }
  }
}
