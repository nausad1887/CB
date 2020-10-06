import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, timer } from 'rxjs';
import { catchError, retry, shareReplay, map, switchMap } from 'rxjs/operators';
import { Interview } from '../candidateInterface';

const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private getInterviewStatus$: Observable<Array<any>>;
  private employeeSize$: Observable<Array<any>>;
  private ownerShipLists$: Observable<Array<any>>;
  private industryLists$: Observable<Array<any>>;
  private countryLists$: Observable<Array<any>>;
  private stateLists$: Observable<Array<any>>;
  private cityLists$: Observable<Array<any>>;
  private plansLists$: Observable<Array<any>>;
  private purchasedPlansLists$: Observable<Array<any>>;
  private interviewModeLists$: Observable<Array<any>>;
  private interviewsScheduled$: Observable<Array<Interview>>;
  private interviewsProcess$: Observable<Array<Interview>>;
  private interviewsReScheduled$: Observable<Array<Interview>>;
  private interviewsUnavailable$: Observable<Array<Interview>>;

  private createJobJDurl = '/jobjd/create-jd';
  private editJobJDurl = '/jobjd/edit-jd';
  private listsJobJDurl = '/jobjd/jd-list';
  private fileUploadUrl = '/employee/file-upload';
  private deactivateJobJDurl = '/jobjd/deactivate-jd';
  private searchJDUrl = '/jobjd/search';
  private jobRoleListsUrl = '/jobrole/get-jobrole-list';
  private employerInterviewsListingUrl = '/interviews/list-interview';
  private interviewStatusListsUrl = '/interviews/get-interviewstatus-list';
  private updateInterviewStatusListsUrl = '/interviews/change-interview-status';
  private deleteInterviewUrl = '/interviews/delete-interview';
  private acceptInterviewUrl = '/interviews/accept-interview';
  private sendOfferUrl = '/interviews/send-offer';
  private rejectInterviewUrl = '/interviews/reject-interview';
  private employerUpdateProfileUrl = '/employer/employer-update-profile';
  private employerUpdateLogoUrl = '/employer/employer-update-profile-picture';
  private employeeSizeUrl = '/empsize/get-empsize-list';
  private ownershipListsUrl = '/ownership/get-ownership-list';
  private industryListsUrl = '/industry/get-industry-list';
  private countryListsUrl = '/country/get-country-list';
  private stateListUrl = '/state/get-state-list';
  private cityListsUrl = '/city/get-city-list';
  private listsFavouritesFolderUrl = '/employerfavorite/list-favorite';
  private addFavouriteFolderUrl = '/employerfavorite/create-favorite';
  private employeeaddeditFavouriteUrl = '/employerfavorite/employee-add-edit-favorite';
  private deleteFavouriteFolderUrl = '/employerfavorite/delete-favorite';
  private editFavouriteFolderUrl = '/employerfavorite/update-favorite';
  private employerViewFavouriteUrl = '/employerfavorite/view-favorite';
  private removeFromFavouritesUrl = '/employerfavorite/remove-from-favorite';
  private listsDownloadsFolderUrl = '/employerdownload/list-download';
  private addDownloadFolderUrl = '/employerdownload/create-download';
  private editDownloadFolderUrl = '/employerdownload/update-download';
  private addEditDownloadUrl = '/employerdownload/employee-add-edit-download';
  private employerUpdateNotificationUrl = '/employer/employer-update-notification-settings';
  private plansListsUrl = '/plans/plans-list';
  private purchasedPlanUrl = '/plans/purchase-plan-list';
  private employerHomeUrl = '/employer/employer-home';
  private interviewModeUrl = '/interviewmode/get-interviewmode-list';
  private scheduleInterviewUrl = '/interviews/schedule-interview';
  private reScheduleInterviewUrl = '/interviews/re-schedule-interview';

  // Behaviour subject
  public post: any;
  updateFilter: BehaviorSubject<any>;
  public makeItEmpty: any;
  updateJobJD: BehaviorSubject<any>;
  public jobJDID: string;
  updateJobJDdetailsPage: BehaviorSubject<string>;
  public updateUser: string;
  updateUserNavbar: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.updateFilter = new BehaviorSubject(this.post);
    this.updateJobJD = new BehaviorSubject(this.makeItEmpty);
    this.updateJobJDdetailsPage = new BehaviorSubject(this.jobJDID);
    this.updateUserNavbar = new BehaviorSubject(this.updateUser);
  }
  httpOptions = {
    headers: new HttpHeaders({}),
  };

  // Update Behaviour subject
  public updateFilterData = (post: any) => {
    this.updateFilter.next(post);
  }
  public updateSelectedJobJDEmpty = (makeNull: any) => {
    this.updateJobJD.next(makeNull);
  }
  public updatepostJDdetailsPage = (jobJD: any) => {
    this.updateJobJDdetailsPage.next(jobJD);
  }
  public updateUserNav = (user: any) => {
    this.updateUserNavbar.next(user);
  }

  public getEmployerHome(data: any): Observable<any> {
    const form = new FormData();
    const home = `[{
      "loginemployerID": "${data.loginemployerID}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', home);
    return this.http
      .post<any>(this.employerHomeUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public getPlansLists(data: any) {
    if (!this.plansLists$) {
      this.plansLists$ = this.plansLists(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.plansLists$;
  }
  public plansLists(data: any): Observable<any> {
    const form = new FormData();
    const plans = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "page":"0",
      "pagesize":"10",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', plans);
    return this.http
      .post<any>(this.plansListsUrl, form, this.httpOptions)
      .pipe(map((response) => response = response[0].data), retry(1), catchError(this.handleError));
  }
  public getPurchasedPlansLists(data: any) {
    if (!this.purchasedPlansLists$) {
      this.purchasedPlansLists$ = this.purchasedPlansLists(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.purchasedPlansLists$;
  }
  public purchasedPlansLists(data: any): Observable<any> {
    const form = new FormData();
    const plans = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', plans);
    return this.http
      .post<any>(this.purchasedPlanUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  get getInterviewModeLists() {
    if (!this.interviewModeLists$) {
      this.interviewModeLists$ = this.interviewModeLists().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.interviewModeLists$;
  }
  public interviewModeLists(): Observable<any> {
    const form = new FormData();
    const mode = `[{
      "loginuserID": "0",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', mode);
    return this.http
      .post<any>(this.interviewModeUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }
  public scheduleInterview = (data: any): Observable<any> => {
    const form = new FormData();
    const scheduleData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "jobroleID": "${data.jobroleID}",
      "jobjdID": "${data.jobjdID}",
      "employeeID": "${data.employeeID}",
      "interviewDate": "${data.interviewDate}",
      "interviewTime": "${data.interviewTime}",
      "interviewmodeID": "${data.interviewmodeID}",
      "interviewContactName": "${data.interviewContactName}",
      "interviewOfficeNo": "${data.interviewOfficeNo}",
      "interviewAddress1": "${data.interviewAddress1}",
      "interviewAddress2": "${data.interviewAddress2}",
      "stateID": "${data.stateID}",
      "cityID": "${data.cityID}",
      "interviewZipcode": "${data.interviewZipcode}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', scheduleData);
    return this.http
      .post<any>(this.scheduleInterviewUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public reScheduleInterview = (data: any): Observable<any> => {
    const form = new FormData();
    const reScheduleData = `[{
      "languageID": "${data.languageID}",
      "interviewID": "${data.interviewID}",
      "rescheduleDate": "${data.rescheduleDate}",
      "rescheduleTime": "${data.rescheduleTime}",
      "rescheduleRemarks": "${data.rescheduleRemarks}",
      "rescheduleBy": "${data.rescheduleBy}",
      "employeeID": "${data.employeeID}",
      "employerID": "${data.employerID}",
      "rescheduleStatusBy": "${data.rescheduleStatusBy}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', reScheduleData);
    return this.http
      .post<any>(this.reScheduleInterviewUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public createJobJd = (data: any): Observable<any> => {
    const form = new FormData();
    const createData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "jobjdName":"${data.jobjdName}",
      "cityID":"${data.cityID}",
      "salaryrangeID":"${data.salaryrangeID}",
      "jobjdexperiance":"${data.jobjdexperiance}",
      "noticeID":"${data.noticeID}",
      "degreeID":"${data.degreeID}",
      "jobjdJobType":"${data.jobjdJobType}",
      "jobjdCertificatation":"${data.jobjdCertificatation}",
      "jobjdOpenings":${data.jobjdOpenings},
      "jobjdDescription":"${data.jobjdDescription}",
      "skilldetails": ${JSON.stringify(data.skilldetails)},
      "jobjdFile": "${data.jobjdFile}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', createData);
    return this.http
      .post<any>(this.createJobJDurl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public editJobJd = (data: any): Observable<any> => {
    const form = new FormData();
    const editData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "jobjdID": "${data.jobjdID}",
      "jobjdName":"${data.jobjdName}",
      "cityID":"${data.cityID}",
      "salaryrangeID":"${data.salaryrangeID}",
      "jobjdexperiance":"${data.jobjdexperiance}",
      "noticeID":"${data.noticeID}",
      "degreeID":"${data.degreeID}",
      "jobjdJobType":"${data.jobjdJobType}",
      "jobjdCertificatation":"${data.jobjdCertificatation}",
      "jobjdOpenings":${data.jobjdOpenings},
      "jobjdDescription":"${data.jobjdDescription}",
      "skilldetails": ${JSON.stringify(data.skilldetails)},
      "jobjdFile": "${data.jobjdFile}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', editData);
    return this.http
      .post<any>(this.editJobJDurl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public updateEmployerProfile = (data: any): Observable<any> => {
    const form = new FormData();
    const updateData = `[{
      "loginemployerID": "${data.loginemployerID}",
      "employerCompany":"${data.employerCompany} ",
      "employerEmail":"${data.employerEmail}",
      "employerContactName":"${data.employerContactName}",
      "employerContactCountryCode":"${data.employerContactCountryCode}",
      "employerContactMobile":"${data.employerContactMobile}",
      "employerDesignation":"${data.employerDesignation}",
      "employerLogo":"${data.employerLogo}",
      "countryID":"${data.countryID}",
      "employerHqAddress":"${data.employerHqAddress}",
      "stateID":"${data.stateID}",
      "cityID":"${data.cityID}",
      "industryID":"${data.industryID}",
      "empsizeID":"${data.empsizeID}",
      "ownershipID":"${data.ownershipID}",
      "employerAbout":"${data.employerAbout}",
      "employerBusinessCertiImage":"${data.employerBusinessCertiImage}",
      "employerDeviceType":"Android",
      "employerDeviceID":"device token",
      "employerBusinessCertiNumber":"${data.employerBusinessCertiNumber}",
      "languageID":"${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', updateData);
    return this.http
      .post<any>(this.employerUpdateProfileUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  public employerUpdateLogo(data: any): Observable<any> {
    const form = new FormData();
    const logo = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerLogo": "${data.employerLogo}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', logo);
    return this.http
      .post<any>(this.employerUpdateLogoUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public employerUpdateNotification(data: any): Observable<any> {
    const form = new FormData();
    const notification = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerNotifyReschedule": "${data.employerNotifyReschedule}",
      "employerNotifyInterview": "${data.employerNotifyInterview}",
      "employerNotifySystem":"${data.employerNotifySystem}",
      "employerDeviceType": "Android",
      "employerDeviceID": "Yes",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', notification);
    return this.http
      .post<any>(this.employerUpdateNotificationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  get getCountryLists() {
    if (!this.countryLists$) {
      this.countryLists$ = this.countryLists().pipe(shareReplay(CACHE_SIZE));
    }
    return this.countryLists$;
  }
  public countryLists(): Observable<any> {
    const form = new FormData();
    const country = `[{
      "loginuserID": "0",
      "searchWord":"",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', country);
    return this.http
      .post<any>(this.countryListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsFavouritesFolder(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.listsFavouritesFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public employerViewFavourites(data: any): Observable<any> {
    const form = new FormData();
    const favourites = ` [{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteID":"${data.employerfavoriteID}",
      "page":"0",
      "pagesize":"20",
      "searchWord":"${data.searchWord}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.employerViewFavouriteUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public removeFromFavourites(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteID":"${data.employerfavoriteID}",
      "employeeID":"${data.employeeID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.removeFromFavouritesUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addFavouriteFolder(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteName":"${data.employerfavoriteName}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.addFavouriteFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public employeeAddEditFavourite(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteID":"${data.employerfavoriteID}",
      "employeeID":"${data.employeeID}",
      "jobjdID": "${data.jobjdID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.employeeaddeditFavouriteUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public deleteFavouriteFolder(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteID":"${data.employerfavoriteID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.deleteFavouriteFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editFavouriteFolder(data: any): Observable<any> {
    const form = new FormData();
    const favourites = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerfavoriteID":"${data.employerfavoriteID}",
      "employerfavoriteName":"${data.employerfavoriteName}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', favourites);
    return this.http
      .post<any>(this.editFavouriteFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsDownloadsFolder(data: any): Observable<any> {
    const form = new FormData();
    const download = `[{
    "languageID": "${data.languageID}",
    "loginemployerID":"${data.loginemployerID}",
    "apiType": "Android",
    "apiVersion": "1.0"
    }]`;
    form.append('json', download);
    return this.http
      .post<any>(this.listsDownloadsFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addDownloadsFolder(data: any): Observable<any> {
    const form = new FormData();
    const download = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerdownloadName":"${data.employerdownloadName}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', download);
    return this.http
      .post<any>(this.addDownloadFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editDownloadFolder(data: any): Observable<any> {
    const form = new FormData();
    const download = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerdownloadID":"${data.employerdownloadID}",
      "employerdownloadName":"${data.employerdownloadName}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', download);
    return this.http
      .post<any>(this.editDownloadFolderUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public employeeAddEditDownload(data: any): Observable<any> {
    const form = new FormData();
    const download = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "employerdownloadID":"${data.employerdownloadID}",
      "employeeID":"${data.employeeID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', download);
    return this.http
      .post<any>(this.addEditDownloadUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getStateLists(data: any) {
    if (!this.stateLists$) {
      this.stateLists$ = this.stateLists(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.stateLists$;
  }
  public stateLists(data: any): Observable<any> {
    const form = new FormData();
    const state = `[{
      "searchWord": "${data.searchWord}",
      "countryID": "${data.countryID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', state);
    this.stateLists$ = this.http
      .post<any>(this.stateListUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    return this.stateLists$;
  }

  public getCityLists(data: any) {
    if (!this.cityLists$) {
      this.cityLists$ = this.cityLists(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.cityLists$;
  }
  public cityLists(data: any): Observable<any> {
    const form = new FormData();
    const city = `[{"loginuserID": "0",
    "searchWord":"${data.searchWord}",
    "countryID":"${data.countryID}",
    "stateID":"${data.stateID}",
    "apiType": "Android",
    "apiVersion": "1.0"
  }]`;
    form.append('json', city);
    this.cityLists$ = this.http
      .post<any>(this.cityListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
    return this.cityLists$;
  }

  get getOwnershipLists() {
    if (!this.ownerShipLists$) {
      this.ownerShipLists$ = this.ownershipLists().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.ownerShipLists$;
  }
  public ownershipLists(): Observable<any> {
    const form = new FormData();
    const ownerShip = `[{
        "loginuserID": "0",
        "searchWord":"",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', ownerShip);
    return this.http
      .post<any>(this.ownershipListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get getIndustryLists() {
    if (!this.industryLists$) {
      this.industryLists$ = this.industryLists().pipe(shareReplay(CACHE_SIZE));
    }
    return this.industryLists$;
  }
  public industryLists(): Observable<any> {
    const form = new FormData();
    const industry = `[{
        "loginuserID": "0",
        "searchWord":"",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', industry);
    return this.http
      .post<any>(this.industryListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get getEmployeeSizeLists() {
    if (!this.employeeSize$) {
      this.employeeSize$ = this.employeeSize().pipe(shareReplay(CACHE_SIZE));
    }
    return this.employeeSize$;
  }
  public employeeSize(): Observable<any> {
    const form = new FormData();
    const size = `[{
      "loginuserID": "0",
      "searchWord":"",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', size);
    return this.http
      .post<any>(this.employeeSizeUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public listJobJd = (data: any): Observable<any> => {
    const form = new FormData();
    const listData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "page":"0",
      "pagesize":"10",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', listData);
    return this.http
      .post<any>(this.listsJobJDurl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public deactivateJobJd = (data: any): Observable<any> => {
    const form = new FormData();
    const listData = `[{
      "languageID": "${data.languageID}",
      "jobjdID":"${data.jobjdID}",
      "jobjdStatus":"${data.jobjdStatus}",
      "loginemployerID":"${data.loginemployerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', listData);
    return this.http
      .post<any>(this.deactivateJobJDurl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public getJobRoleLists = (): Observable<any> => {
    const form = new FormData();
    const listData = `[{
      "loginuserID": "0",
      "searchWord":"",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', listData);
    return this.http
      .post<any>(this.jobRoleListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  public searchJD = (data: any): Observable<any> => {
    const form = new FormData();
    const searchData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "skillIDs": "${data.skillIDs}",
      "empworkDesignation": "${data.empworkDesignation}",
      "jobjdName": "${data.jobjdName}",
      "cityID": ${data.cityID},
      "minval": "${data.minval}",
      "maxval": "${data.maxval}",
      "expMinVal": "${data.expMinVal}",
      "expMaxVal": "${data.expMaxVal}",
      "empcertificateName": "${data.empcertificateName}",
      "noticeID": "${data.noticeID}",
      "emplanguageName": "${data.emplanguageName}",
      "empkycExpYear": "${data.empkycExpYear}",
      "degreeID": "${data.degreeID}",
      "industryIDs": "${data.industryIDs}",
      "noticeIDs": "${data.noticeIDs}",
      "regionIDs": "${data.regionIDs}",
      "countryIDs": "${data.countryIDs}",
      "cityIDs": "${data.cityIDs}",
      "avialablefromIDs": "${data.avialablefromIDs}",
      "emplanguageNames": "${data.emplanguageNames}",
      "degreeIDs": "${data.degreeIDs}",
      "cvduration":"${data.cvduration}",
      "page": "0",
      "pagesize": "100",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', searchData);
    return this.http
      .post<any>(this.searchJDUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public inprocess(data: any) {
    if (!this.interviewsProcess$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.interviewsProcess$ = timer$.pipe(
        switchMap(_ => this.interviewsProcess(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.interviewsProcess$;
  }
  public interviewsProcess(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "14",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].inprogress), retry(2), catchError(this.handleError));
  }

  public scheduled(data: any) {
    if (!this.interviewsScheduled$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.interviewsScheduled$ = timer$.pipe(
        switchMap(_ => this.interviewsScheduled(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.interviewsScheduled$;
  }
  public interviewsScheduled(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "1",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].scheduled), retry(2), catchError(this.handleError));
  }

  public rescheduled(data: any) {
    if (!this.interviewsReScheduled$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.interviewsReScheduled$ = timer$.pipe(
        switchMap(_ => this.interviewsRescheduled(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.interviewsReScheduled$;
  }
  public interviewsRescheduled(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "3",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].reschedule), retry(2), catchError(this.handleError));
  }

  public unavailable(data: any) {
    if (!this.interviewsUnavailable$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.interviewsUnavailable$ = timer$.pipe(
        switchMap(_ => this.interviewsUnavailabe(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.interviewsUnavailable$;
  }
  public interviewsUnavailabe(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "4",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].unavailable), retry(2), catchError(this.handleError));
  }

  get getInterviewStatusLists() {
    if (!this.getInterviewStatus$) {
      this.getInterviewStatus$ = this.statusLists().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.getInterviewStatus$;
  }
  // getting interview status list
  public statusLists(): Observable<any> {
    const form = new FormData();
    const statusData = `[{
      "loginuserID": "0",
      "searchWord":"",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', statusData);
    return this.http
      .post<any>(this.interviewStatusListsUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // updating interview status
  public updateInterviewStatusLists(data: any): Observable<any> {
    const form = new FormData();
    const updateStatusData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "interviewID":"${data.interviewID}",
      "interviewstatusID":"${data.interviewstatusID}",
      "interviewStatusRemarks":"${data.interviewStatusRemarks}",
      "employeeID":"${data.employeeID}",
      "employerID":"${data.employerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', updateStatusData);
    return this.http
      .post<any>(this.updateInterviewStatusListsUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // deleting interview
  public deletingInterview(data: any): Observable<any> {
    const form = new FormData();
    const deleteData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "interviewID":"${data.interviewID}",
      "employeeID":"${data.employeeID}",
      "employerID":"${data.employerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', deleteData);
    return this.http
      .post<any>(this.deleteInterviewUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // accept interview
  public acceptInterview(data: any): Observable<any> {
    const form = new FormData();
    const acceptInterviewData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "interviewID":"${data.interviewID}",
      "rescheduleID":"${data.rescheduleID}",
      "rescheduleStatusBy":"${data.rescheduleStatusBy}",
      "employeeID":"${data.employeeID}",
      "employerID":"${data.employerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', acceptInterviewData);
    return this.http
      .post<any>(this.acceptInterviewUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // send offer
  public sendOffer(data: any): Observable<any> {
    const form = new FormData();
    const sendOffer = `[{
      "languageID": "${data.languageID}",
      "interviewID": "${data.interviewID}",
      "employerID": "${data.employerID}",
      "jobjdID": "${data.jobjdID}",
      "employeeID": "${data.employeeID}",
      "offerPosition": "${data.offerPosition}",
      "offerSalary": "${data.offerSalary}",
      "offerLocation": "${data.offerLocation}",
      "offerTypeofJob": "${data.offerTypeofJob}",
      "offerJoiningDate": "${data.offerJoiningDate}",
      "offerDetails": "${data.offerDetails}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', sendOffer);
    return this.http
      .post<any>(this.sendOfferUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // Reject Interview
  public rejectInterview(data: any): Observable<any> {
    const form = new FormData();
    const statusData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID":"${data.loginemployerID}",
      "interviewID":"${data.interviewID}",
      "reasonID":"${data.reasonID}",
      "interviewRejectRemarks":"${data.interviewRejectRemarks}",
      "rescheduleID":"${data.rescheduleID}",
      "rescheduleStatusBy":"${data.rescheduleStatusBy}",
      "employeeID":"${data.employeeID}",
      "employerID":"${data.employerID}",
      "apiType": "Android",
      "apiVersion": "1.0"
      }]`;
    form.append('json', statusData);
    return this.http
      .post<any>(this.rejectInterviewUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // this is for progress for file upload
  public file = (filedata: any) => {
    const req = new HttpRequest('POST', this.fileUploadUrl, filedata.file, {
      reportProgress: true,
    });
    this.http.request(req).subscribe((event) => {
      // Via this API, you get access to the raw event stream.
      // Look for upload progress events.
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        // nothing(`File is ${percentDone}% uploaded.`);
      } else if (event instanceof HttpResponse) {
        // nothing('File is completely uploaded!');
      }
    });
  }
  // uploading files
  uploadFile(fileData: any): Observable<any> {
    this.file(fileData);
    const form = new FormData();
    const x =
      '[{"loginuserID": "' +
      fileData.loginemployerID +
      '", "apiType": "Android","apiVersion": "1.0"}]';
    const fileField = fileData.file;
    const filePath = fileData.filePath;
    form.append('json', x);
    form.append('FileField', fileField);
    form.append('FilePath', filePath);
    return this.http
      .post<any>(this.fileUploadUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // ErrorHandling
  public handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get Client Side Error
      errorMessage = error.error.messages;
    } else {
      // Get Server-Side Error
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.messsage}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public interviews(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "${data.interviewstatusID}",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  public interviewed(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "5",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].Interviewed), retry(1), catchError(this.handleError));
  }
  public selected(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "6",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].selectedonboarding), retry(1), catchError(this.handleError));
  }
  public selectedONboarding(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "12",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].selected), retry(1), catchError(this.handleError));
  }
  public rejected(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "7",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].rejected), retry(1), catchError(this.handleError));
  }
  public interviewDeclined(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "8",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].interviewdeclinedbycandidate), retry(1), catchError(this.handleError));
  }
  public jobDeclined(data: any): Observable<any> {
    const form = new FormData();
    const listingsData = `[{
           "languageID": "${data.languageID}",
           "loginemployerID": "${data.loginemployerID}",
           "employeeID": "${data.employeeID}",
           "type": "${data.type}",
           "jobjdID": "${data.jobjdID}",
           "interviewstatusID": "9",
           "page": "0",
           "pagesize": "10",
           "apiType": "Android",
           "apiVersion": "1.0"
          }]`;
    form.append('json', listingsData);
    return this.http
      .post<any>(this.employerInterviewsListingUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data[0].jobdeclinedbycandidate), retry(1), catchError(this.handleError));
  }
}
