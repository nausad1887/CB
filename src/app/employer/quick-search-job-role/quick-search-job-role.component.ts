import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { SearchJDdata } from 'src/app/candidateInterface';

@Component({
  selector: 'app-quick-search-job-role',
  templateUrl: './quick-search-job-role.component.html',
  styleUrls: ['./quick-search-job-role.component.css'],
})
export class QuickSearchJobRoleComponent implements OnInit {
  public jobRoleLists = [];
  public selectedJobRole: string;
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
  @Output() quickSearchJobRole: EventEmitter<any> = new EventEmitter();
  constructor(
    public employerService: EmployerService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.updateJobJD();
    this.getJobRoleLists();
  }

  public updateJobJD = () => {
    this.employerService.updateJobJD.subscribe((empty) => {
      empty ? (this.selectedJobRole = empty) : (this.selectedJobRole = '');
    });
  }

  public onQuickSearchJobRole = (jobRole: string) => {
    this.selectedJobRole = jobRole;
    this.searchJDdata.empworkDesignation = jobRole;
    this.quickSearchJobRole.emit(this.searchJDdata);
  }

  // getting job role lists
  public getJobRoleLists: any = () => {
    return new Promise((resolve, reject) => {
      return this.employerService.getJobRoleLists().subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.jobRoleLists = response[0].data;
            this.jobRoleLists.sort((a, b) => {
              return a.jobroleID - b.jobroleID;
            });
            resolve(this.jobRoleLists);
          } else {
            console.error(response[0].message);
            reject(response[0].message);
          }
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }// end of getCities
}
