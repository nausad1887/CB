import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmployerService } from '../employer.service';
import { HomeService } from 'src/app/home.service';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { SearchJDdata, City, Notice, Skill } from 'src/app/candidateInterface';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-shared-global-search',
  templateUrl: './shared-global-search.component.html',
  styleUrls: ['./shared-global-search.component.css'],
})
export class SharedGlobalSearchComponent implements OnInit {
  @Output() searchItem: EventEmitter<any> = new EventEmitter();

  cityLists$: Observable<Array<City>>;
  skillslist$: Observable<Array<Skill>>;
  noticeLists$: Observable<Array<Notice>>;
  sallaryRange$: Observable<Array<any>>;
  public subscriptionSkills: Subscription;
  searchInputForm: FormGroup;

  private employerData: any;
  public languageLists = [
    { id: '1.0', value: 'English' },
    { id: '2.0', value: 'Hindi' },
    { id: '3.0', value: 'Gujarati' },
    { id: '4.0', value: 'Chinese' },
    { id: '5.0', value: 'Spanish' },
    { id: '6.0', value: 'Arabic' },
  ];
  public expYears = [
    { id: '0.0', value: 'Fresher' },
    { id: '1.0', value: '1 Years' },
    { id: '2.0', value: '2 Years' },
    { id: '3.0', value: '3 Years' },
    { id: '4.0', value: '4 Years' },
    { id: '5.0', value: '5 Years & Above' },
  ];
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
    public fb: FormBuilder,
    public employerService: EmployerService,
    private homeService: HomeService,
    public candidateService: CandidateService
  ) {
    this.searchInputForm = fb.group({
      skills: [[], Validators.compose([])],
      location: [null, Validators.compose([])],
      experiance: [null, Validators.compose([])],
      sallary: [null, Validators.compose([])],
      certificate: ['', Validators.compose([])],
      notice: [null, Validators.compose([])],
      language: [null, Validators.compose([])],
    });
  }

  ngOnInit(): void {
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.cityLists$ = this.candidateService.cities;
    this.noticeLists$ = this.candidateService.notices;
    this.skillslist$ = this.candidateService.skills;
    this.sallaryRange$ = this.candidateService.sallary;
  }

  public search = (post: any) => {
    if (post.skills.length > 0 || post.sallary || post.certificate || post.language || post.location || post.notice || post.experiance) {
      this.searchJDdata.cityID = post.location ? post.location : '0';
      this.searchJDdata.noticeID = post.notice ? post.notice : '';
      this.searchJDdata.empkycExpYear = post.experiance ? post.experiance : '';
      this.searchJDdata.loginemployerID = this.employerData.employerID;
      this.searchJDdata.skillIDs = post.skills.length > 0 ? post.skills.toString() : '';
      this.searchJDdata.minval = post.sallary ? post.sallary : '1';
      this.searchJDdata.empcertificateName = post.certificate ? post.certificate : '';
      this.searchJDdata.emplanguageName = post.language ? post.language : '';
      this.searchItem.emit(JSON.stringify(this.searchJDdata));
      this.employerService.updateSelectedJobJDEmpty(null);
    }
  }
}
