import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EmployerService } from '../employer.service';
import { CandidateService } from 'src/app/candidate/candidate.service';
import { debounceTime, map, distinctUntilChanged, mergeMap, delay } from 'rxjs/operators';
import { of, Subject, Subscription, Observable } from 'rxjs';
import { SearchJDdata, City, Notice, Availabe, Skill, } from 'src/app/candidateInterface';
@Component({
  selector: 'app-shared-filter',
  templateUrl: './shared-filter.component.html',
  styleUrls: ['./shared-filter.component.css'],
})
export class SharedFilterComponent implements OnInit, OnDestroy {
  cityLists$: Observable<Array<City>>;
  noticeLists$: Observable<Array<Notice>>;
  availableList$: Observable<Array<Availabe>>;
  skillslist$: Observable<Array<Skill>>;
  industrieslist$: Observable<Array<any>>;
  degreelist$: Observable<Array<any>>;
  countrylist$: Observable<Array<any>>;

  public show = 6;
  public selectedJobRole: string;
  public selectedSkills = [];
  public selectedExp = [];
  public selectedNotice = [];
  public selectedCities = [];
  public selectedAvailableLists = [];
  public selectedDegree = [];
  public selectedCountries = [];
  public selectedKnownLanguage = [];
  public selectedIndustries = [];
  public searchWord: string;
  public searchLan: string;
  public searchExp: string;
  public mySallaryRange: any;
  public myExperianceRange: any;
  @Output() skillsIDs: EventEmitter<any> = new EventEmitter();
  @Output() industryIDs: EventEmitter<any> = new EventEmitter();
  @Output() noticeIDs: EventEmitter<any> = new EventEmitter();
  @Output() cityIDs: EventEmitter<any> = new EventEmitter();
  @Output() availableIDs: EventEmitter<any> = new EventEmitter();
  @Output() degreeIDs: EventEmitter<any> = new EventEmitter();
  @Output() countryIDs: EventEmitter<any> = new EventEmitter();
  @Output() languageIDs: EventEmitter<any> = new EventEmitter();
  @Output() salaryRange: EventEmitter<any> = new EventEmitter();
  @Output() experianceRange: EventEmitter<any> = new EventEmitter();
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
  public keySkills = new Subject<KeyboardEvent>();
  public keyIndustries = new Subject<KeyboardEvent>();
  public keyCities = new Subject<KeyboardEvent>();
  public keyDegrees = new Subject<KeyboardEvent>();
  public keyNotice = new Subject<KeyboardEvent>();
  public keyAvailable = new Subject<KeyboardEvent>();
  public keyCountry = new Subject<KeyboardEvent>();
  // subscription
  public subscription: Subscription;
  constructor(
    public employerService: EmployerService,
    public candidateService: CandidateService
  ) {
    // for skills
    this.subscription = this.keySkills
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getSkillsLists();
      });
    // for industries
    this.subscription = this.keyIndustries
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getIndustriesLists();
      });
    // for notice
    this.subscription = this.keyNotice
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getNoticeLists();
      });
    // for cities
    this.subscription = this.keyCities
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getCities();
      });
    // for degree
    this.subscription = this.keyDegrees
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getDegreeLists();
      });
    // for available list
    this.subscription = this.keyAvailable
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getAvailableLists();
      });
    // for country list
    this.subscription = this.keyCountry
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(100),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.searchWord = input;
        this.getCountryLists();
      });
  }
  ngOnInit(): void {
    this.cityLists$ = this.candidateService.cities;
    this.noticeLists$ = this.candidateService.notices;
    this.skillslist$ = this.candidateService.skills;
    this.availableList$ = this.candidateService.availabe;
    this.updateFilter();
    this.jqueryEvent();
    this.synchronous();
  }

  public updateFilter = () => {
    this.employerService.updateFilter.subscribe((response) => {
      if (response) {
        this.makeItDefault(response);
        setTimeout(() => {
          response.cityID && response.cityID !== '0' ? this.selectedCities = response.cityID.split() : this.selectedCities = [];
          response.noticeID ? this.selectedNotice = response.noticeID.split() : this.selectedNotice = [];
          response.emplanguageName ? this.selectedKnownLanguage = response.emplanguageName.split() : this.selectedKnownLanguage = [];
          response.skillIDs ? this.selectedSkills = response.skillIDs.split(',') : this.selectedSkills = [];
          response.empkycExpYear ? this.selectedExp = response.empkycExpYear.split() : this.selectedExp = [];
        }, 500);
      }
    });
  }
  public makeItDefault = (response: any) => {
    this.searchJDdata.cityIDs = response.cityID;
    this.searchJDdata.noticeIDs = response.noticeID;
    this.searchJDdata.emplanguageName = response.emplanguageName;
    this.searchJDdata.skillIDs = response.skillIDs;
    this.searchJDdata.empkycExpYear = response.empkycExpYear;
    this.searchJDdata.empcertificateName = response.empcertificateName;
  }
  public trackSkill = (skill: any) => {
    return skill.checked;
  }
  // checked box data
  public onChangeSkills = (skillID: string) => {
    const index = this.selectedSkills.indexOf(skillID);
    if (index === -1) {
      this.selectedSkills.push(skillID);
      this.searchJDdata.skillIDs = this.selectedSkills.toString();
      this.skillsIDs.emit(this.searchJDdata);
    } else {
      this.selectedSkills.splice(index, 1);
      this.searchJDdata.skillIDs = this.selectedSkills.toString();
      this.skillsIDs.emit(this.searchJDdata);
    }
  }
  public onChangeIndustry = (industryID: string) => {
    const index = this.selectedIndustries.indexOf(industryID);
    if (index === -1) {
      this.selectedIndustries.push(industryID);
      this.searchJDdata.industryIDs = this.selectedIndustries.toString();
      this.industryIDs.emit(this.searchJDdata);
    } else {
      this.selectedIndustries.splice(index, 1);
      this.searchJDdata.industryIDs = this.selectedIndustries.toString();
      this.industryIDs.emit(this.searchJDdata);
    }
  }
  public onChangeNotice = (noticeID: string) => {
    const index = this.selectedNotice.indexOf(noticeID);
    if (index === -1) {
      this.selectedNotice.push(noticeID);
      this.searchJDdata.noticeIDs = this.selectedNotice.toString();
      this.noticeIDs.emit(this.searchJDdata);
    } else {
      this.selectedNotice.splice(index, 1);
      this.searchJDdata.noticeIDs = this.selectedNotice.toString();
      this.noticeIDs.emit(this.searchJDdata);
    }
  }
  public onChangeExperiance = (expID: string) => {
    this.selectedExp = [];
    this.selectedExp.push(expID);
    this.searchJDdata.empkycExpYear = expID;
    this.experianceRange.emit(this.searchJDdata);
  }
  public onChangeCity = (cityID: string) => {
    const index = this.selectedCities.indexOf(cityID);
    if (index === -1) {
      this.selectedCities.push(cityID);
      this.searchJDdata.cityIDs = this.selectedCities.toString();
      this.cityIDs.emit(this.searchJDdata);
    } else {
      this.selectedCities.splice(index, 1);
      this.searchJDdata.cityIDs = this.selectedCities.toString();
      this.cityIDs.emit(this.searchJDdata);
    }
  }
  public onChangeAvailableList = (availableID: string) => {
    const index = this.selectedAvailableLists.indexOf(availableID);
    if (index === -1) {
      this.selectedAvailableLists.push(availableID);
      this.searchJDdata.avialablefromIDs = this.selectedAvailableLists.toString();
      this.availableIDs.emit(this.searchJDdata);
    } else {
      this.selectedAvailableLists.splice(index, 1);
      this.searchJDdata.avialablefromIDs = this.selectedAvailableLists.toString();
      this.availableIDs.emit(this.searchJDdata);
    }
  }
  public onChangeDegree = (degreeID: string) => {
    const index = this.selectedDegree.indexOf(degreeID);
    if (index === -1) {
      this.selectedDegree.push(degreeID);
      this.searchJDdata.degreeIDs = this.selectedDegree.toString();
      this.degreeIDs.emit(this.searchJDdata);
    } else {
      this.selectedDegree.splice(index, 1);
      this.searchJDdata.degreeIDs = this.selectedDegree.toString();
      this.degreeIDs.emit(this.searchJDdata);
    }
  }
  public onChangeCountry = (countryID: string) => {
    const index = this.selectedCountries.indexOf(countryID);
    if (index === -1) {
      this.selectedCountries.push(countryID);
      this.searchJDdata.countryIDs = this.selectedCountries.toString();
      this.countryIDs.emit(this.searchJDdata);
    } else {
      this.selectedCountries.splice(index, 1);
      this.searchJDdata.countryIDs = this.selectedCountries.toString();
      this.countryIDs.emit(this.searchJDdata);
    }
  }
  public onChangeLanguage = (languageName: string) => {
    const index = this.selectedKnownLanguage.indexOf(languageName);
    if (index === -1) {
      this.selectedKnownLanguage.push(languageName);
      this.searchJDdata.emplanguageNames = this.selectedKnownLanguage.toString();
      this.languageIDs.emit(this.searchJDdata);
    } else {
      this.selectedKnownLanguage.splice(index, 1);
      this.searchJDdata.emplanguageNames = this.selectedKnownLanguage.toString();
      this.languageIDs.emit(this.searchJDdata);
    }
  }
  // filter method
  public getSkillsLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.skillslist$ = this.candidateService.getSkillsLists(data);
  }
  public getIndustriesLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.industrieslist$ = this.candidateService.getIndustryLists(data);
  }
  public getCities = () => {
    const data = {loginuserID: '', countryID: '0', stateID: '0', searchWord: this.searchWord ? this.searchWord : ''};
    this.cityLists$ = this.candidateService.getCityLists(data);
  }
  public getNoticeLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.noticeLists$ = this.candidateService.getNoticeLists(data);
  }
  public getCountryLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.countrylist$ = this.candidateService.getCountryLists(data);
  }
  public getDegreeLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.degreelist$ = this.candidateService.getDegreeLists(data);
  }
  public getAvailableLists = () => {
    const data = {searchWord: this.searchWord ? this.searchWord : ''};
    this.availableList$ = this.candidateService.getAvailableFromLists(data);
  }
  public synchronous = async () => {
    this.getIndustriesLists();
    this.getDegreeLists();
    this.getCountryLists();
  }

  // jquery data
  public jqueryEvent = () => {
    // for sallary
    ($('#demo_1') as any).ionRangeSlider({
      type: 'double',
      grid: true,
      min: this.searchJDdata.minval,
      max: this.searchJDdata.maxval,
      from: 1000,
      to: 400000,
      prefix: `<span class='iconify' data-icon='fa-inr' data-inline='false'></span>`,
      onFinish: this.saveResult,
      onUpdate: this.onUpdateSallarySlider
    });
    // Saving it's instance
    this.mySallaryRange = $('#demo_1').data('ionRangeSlider');
  }
  saveResult = (data: any) => {
    this.searchJDdata.minval = data.from;
    this.searchJDdata.maxval = data.to;
    this.salaryRange.emit(this.searchJDdata);
  }
  onUpdateSallarySlider = (data: any) => {
    this.searchJDdata.minval = data.min;
    this.searchJDdata.maxval = data.max;
  }

  public clearFilter = () => {
    this.selectedJobRole = '';
    this.selectedSkills = [];
    this.selectedNotice = [];
    this.selectedCities = [];
    this.selectedAvailableLists = [];
    this.selectedDegree = [];
    this.selectedCountries = [];
    this.selectedExp = [];
    this.selectedKnownLanguage = [];
    this.selectedIndustries = [];
    this.searchJDdata.skillIDs = '';
    this.searchJDdata.noticeIDs = '';
    this.searchJDdata.industryIDs = '';
    this.searchJDdata.emplanguageName = '';
    this.searchJDdata.countryIDs = '';
    this.searchJDdata.degreeIDs = '';
    this.searchJDdata.cityIDs = '';
    this.searchJDdata.empworkDesignation = '';
    this.jqueryEvent();
    this.unCheckedAllCheckedBox();
  }
  public unCheckedAllCheckedBox = () => {
    $('input:checkbox').prop('checked', false);
    // reset to its first value
    this.mySallaryRange.reset();
  }

  ngOnDestroy(): void {
  }
}
