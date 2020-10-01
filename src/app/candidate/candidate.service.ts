import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, timer } from 'rxjs';
import { retry, catchError, shareReplay, switchMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { City, Notice, Availabe, Skill, Interview } from '../candidateInterface';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;
@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private cityLists$: Observable<Array<City>>;
  private noticeLists$: Observable<Array<Notice>>;
  private sallaryRangeLists$: Observable<Array<any>>;
  private degreeLists$: Observable<Array<any>>;
  private availabeLists$: Observable<Array<Availabe>>;
  private skillsList$: Observable<Array<Skill>>;
  private getListsSelected$: Observable<Array<Interview>>;
  private getListsJobDeclinedByCandidate$: Observable<Array<Interview>>;
  private getListsRejected$: Observable<Array<Interview>>;
  private getListsInterviewed$: Observable<Array<Interview>>;
  private getListsReasons$: Observable<Array<any>>;

  private employeeKycAddUrl = '/employee/employee-kyc-add-edit';
  private employeeUpdateProfileUrl = '/employee/employee-update-profile';
  private countryListsUrl = '/country/get-country-list';
  private stateListUrl = '/state/get-state-list';
  private cityListsUrl = '/city/get-city-list';
  private availableFromListUrl = '/avialablefrom/get-avialablefrom-list';
  private noticeListsUrl = '/notice/get-notice-list';
  private proofOfAddUrl = '/proofadd/get-proofadd-list';
  private proofOfIDListsUrl = '/proofid/get-proofid-list';
  private sallaryRangeListsUrl = '/salaryrange/get-salaryrange-list';
  private fileUploadUrl = '/employee/file-upload';
  private employeeUpdateProfilePictureUrl = '/employee/employee-update-profile-picture';
  private updateResumeUrl = '/employee/employee-update-resume';
  public addEmployeeSkillsUrl = '/employeeskill/add-employee-skill';
  private editEmployeeSkillsUrl = '/employeeskill/edit-employee-skill';
  private listsEmployeeSkillsUrl = '/employeeskill/list-employee-skill';
  private deleteEmployeeSkillsUrl = '/employeeskill/delete-employee-skill';
  private skillsListUrl = '/skill/get-skill-list';
  private getDegreeListUrl = '/degree/get-degree-list';
  private getUniversityListsUrl = '/university/get-university-list';
  private addEmployeeEducationUrl = '/employeeeducation/add-employee-education';
  private editEmployeeEducationUrl = '/employeeeducation/edit-employee-education';
  private deleteEmployeeEducationUrl = '/employeeeducation/delete-employee-education';
  private listsEmployeeEducationUrl = '/employeeeducation/list-employee-education';
  private specialisationListsUrl = '/specialisation/get-specialisation-list';
  private addEmploymentUrl = '/employeework/add-employeework';
  private editEmploymentUrl = '/employeework/edit-employeework';
  private deleteEmploymentUrl = '/employeework/delete-employeework';
  private employmentListsUrl = '/employeework/list-employeework';
  private companyListsUrl = '/company/get-company-list';
  private regionListsUrl = '/region/get-region-list';
  private industryListsUrl = '/industry/get-industry-list';
  private addCertificateUrl = '/employeecertificates/add-employee-certificates';
  private editCertificateUrl = '/employeecertificates/edit-employee-certificates';
  private deleteCertificateUrl = '/employeecertificates/delete-employee-certificates';
  private listsCirtificateUrl = '/employeecertificates/list-employee-certificates';
  private addAwardUrl = '/employeeawards/add-employee-awards';
  private editAwardUrl = '/employeeawards/edit-employee-awards';
  private listAwardUrl = '/employeeawards/list-employee-awards';
  private deleteAwardUrl = '/employeeawards/delete-employee-awards';
  private addWorkProfileUrl = '/employeeworkprofile/add-employee-workprofile';
  private editWorkProfileUrl = '/employeeworkprofile/edit-employee-workprofile';
  private listsWorkProfileUrl = '/employeeworkprofile/list-employee-workprofile';
  private deleteWorkProfileUrl = '/employeeworkprofile/delete-employee-workprofile';
  private employeeAddLanguageUrl = '/employeelanguage/add-employeelanguage';
  private employeeEditLanguageUrl = '/employeelanguage/edit-employeelanguage';
  private employeeLanguageListsUrl = '/employeelanguage/list-employeelanguage';
  private employeeDeleteLanguageUrl = '/employeelanguage/delete-employeelanguage';
  private employeeProfileVisibleFromUrl = '/employee/employee-profile-visible-from';
  private employeeSendToAdminForAprovalUrl = '/employee/employee-send-approval';
  private employeeNotificationSettingsUrl = '/employee/employee-update-notification-settings';
  private employeeInterviewRequestsUrl = '/interviews/employee-list-interview';
  private employeeInterviewsListingUrl = '/interviews/list-interview';
  private interviewStatusListsUrl = '/interviews/get-interviewstatus-list';
  private acceptInterviewUrl = '/interviews/accept-interview';
  private rejectInterviewUrl = '/interviews/reject-interview';
  private reasonListSUrl = '/reason/get-reason-list';
  private reScheduleInterviewUrl = '/interviews/re-schedule-interview';

  // Behavior Subject
  public currentCandidate: any;
  updateData: BehaviorSubject<any>;

  public updateComponent: any;
  updateAllComponenet: BehaviorSubject<any>;

  constructor(public http: HttpClient) {
    this.updateData = new BehaviorSubject(this.currentCandidate);
    this.updateAllComponenet = new BehaviorSubject(this.currentCandidate);
  }
  httpOptions = {
    headers: new HttpHeaders({}),
  };
  public updateCurrentCandidate = (data: any) => {
    this.updateData.next(data);
  }
  public updateComponents = (data: any) => {
    this.updateAllComponenet.next(data);
  }

  // employee notification settings
  public employeeUpdateNotificationSettings(data: any): Observable<any> {
    const form = new FormData();
    const visibleData = `[{
        "languageID": "${data.languageID}",
        "loginemployeeID": "${data.loginemployeeID}",
        "employeeNotifyJobStatus": "${data.employeeNotifyJobStatus}",
        "employeeNotifyNewInterview": "${data.employeeNotifyNewInterview}",
        "employeeNotifyAdminResponse":"${data.employeeNotifyAdminResponse}",
        "employeeDeviceType": "Android",
        "employeeDeviceID": "57d0e7a3403b1107",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', visibleData);
    return this.http
      .post<any>(this.employeeNotificationSettingsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // employee visibility
  public employeeProfileVisibleFrom(data: any): Observable<any> {
    const form = new FormData();
    const visibleData = `[{
        "loginemployeeID": "${data.loginemployeeID}",
        "languageID": "${data.languageID}",
        "employeeServiceNotice":"${data.employeeServiceNotice}",
        "employeeProfileVisibleFrom":"${data.employeeProfileVisibleFrom}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', visibleData);
    return this.http
      .post<any>(this.employeeProfileVisibleFromUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // send to admin for aproval
  public employeeSendToAdminForApproval(data: any): Observable<any> {
    const form = new FormData();
    const approvalData = `[{
        "loginemployeeID": "${data.loginemployeeID}",
        "languageID": "${data.languageID}",
        "employeeSendAdminApproval":"${data.employeeSendAdminApproval}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', approvalData);
    return this.http
      .post<any>(this.employeeSendToAdminForAprovalUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  get degree() {
    if (!this.degreeLists$) {
      const data = {
        searchWord: '',
      };
      this.degreeLists$ = this.getDegreeLists(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.degreeLists$;
  }
  public getDegreeLists(data: any): Observable<any> {
    const form = new FormData();
    const degreeData = `[{
      "loginuserID": "0",
      "searchWord":"${data.searchWord}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', degreeData);
    return this.http
      .post<any>(this.getDegreeListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public getCompanyLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      `[{
        "loginuserID": "0",
        "searchWord":"${data.searchWord}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.companyListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getIndustryLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0","searchWord":"' +
      data.searchWord +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.industryListsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public getRegionLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0","searchWord":"' +
      data.searchWord +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.regionListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getUniversityLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0","searchWord":"' +
      data.searchWord +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.getUniversityListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getSpecialisationLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0","searchWord":"' +
      data.searchWord +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.specialisationListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get skills() {
    if (!this.skillsList$) {
      const data = {
        searchWord: '',
      };
      this.skillsList$ = this.getSkillsLists(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.skillsList$;
  }
  public getSkillsLists(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
        "loginuserID": "0",
        "searchWord":"${data.searchWord}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.skillsListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public addEmployeeKnownLanguage = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID":"1",
  "loginemployeeID":"${data.loginemployeeID}",
  "emplanguageName":"${data.emplanguageName}",
  "emplanguageRead":"${data.emplanguageRead}",
  "emplanguageWrite":"${data.emplanguageWrite}",
  "emplanguageSpeak":"${data.emplanguageSpeak}",
  "apiType":"Android",
  "apiVersion":"1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.employeeAddLanguageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editEmployeeKnownLanguage = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "emplanguageID":"${data.emplanguageID}",
  "emplanguageName":"${data.emplanguageName}",
  "emplanguageRead":"${data.emplanguageRead}",
  "emplanguageWrite":"${data.emplanguageWrite}",
  "emplanguageSpeak":"${data.emplanguageSpeak}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.employeeEditLanguageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsEmployeeKnownLanguage = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.employeeLanguageListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteEmployeeKnownLanguage = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "emplanguageID":"${data.emplanguageID}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.employeeDeleteLanguageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addWorkProfile = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
  "empworkprofileName":"${data.empworkprofileName}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.addWorkProfileUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editWorkProfile = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empworkprofileID": "${data.empworkprofileID}",
  "empworkprofileName":"${data.empworkprofileName}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.editWorkProfileUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsWorkProfile = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.listsWorkProfileUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteWorkProfile = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
  "empworkprofileID":"${data.empworkprofileID}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.deleteWorkProfileUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addEmployeeAward = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
  "empawardName":"${data.empawardName}",
  "empawardIssuedBy":"${data.empawardIssuedBy}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.addAwardUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editEmployeeAward = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empaward": "${data.empaward}",
  "empawardName":"${data.empawardName}",
  "empawardIssuedBy":"${data.empawardIssuedBy}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.editAwardUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsEmployeeAward = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.listAwardUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteEmployeeAward = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empaward":"${data.empaward}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.deleteAwardUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addEmployeeCertificate = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empcertificateName":"${data.empcertificateName}",
  "empcertificateIssuedBy":"${data.empcertificateIssuedBy}",
  "empcertificateValidTill":"${data.empcertificateValidTill}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.addCertificateUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editEmployeeCertificate = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empcertificateName":"${data.empcertificateName}",
  "empcertificateID":"${data.empcertificateID}",
  "empcertificateIssuedBy":"${data.empcertificateIssuedBy}",
  "empcertificateValidTill":"${data.empcertificateValidTill}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.editCertificateUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listsEmployeeCertificate = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.listsCirtificateUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteEmployeeCertificate = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empcertificateID":"${data.empcertificateID}",
	"apiType": "Android",
	"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.deleteCertificateUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addEmployeeEmployment = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empworkID": "${data.empworkID}",
  "countryName": "${data.countryName}",
  "regionName": "${data.regionName}",
  "industryName": "${data.industryName}",
  "ownershipName": "${data.ownershipName}",
  "companyName": "${data.companyName}",
  "companyID": "${data.companyID}",
  "regionID": "${data.regionID}",
  "ownershipID": "${data.ownershipID}",
  "industryID": "${data.industryID}",
  "empworkFrom": "${data.empworkFrom}",
  "empworkTo": "${data.empworkTo}",
  "empworkDesignation": "${data.empworkDesignation}",
  "empworkDetails": "${data.empworkDetails}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.addEmploymentUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editEmployeeEmployment = (data: any) => {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
  "loginemployeeID": "${data.loginemployeeID}",
  "empworkID":"${data.empworkID}",
  "countryName":"${data.countryName}",
  "regionName":"${data.regionName}",
  "industryName":"${data.industryName} ",
  "ownershipName":"${data.ownershipName}",
  "companyName":"${data.companyName} ",
  "companyID":"${data.companyID}",
  "regionID":"${data.regionID}",
  "countryID":"${data.countryID}",
  "ownershipID":"${data.ownershipID}",
  "industryID":"${data.industryID}",
  "empworkFrom":"${data.empworkFrom}",
  "empworkTo":"${data.empworkTo}",
  "empworkDesignation":"${data.empworkDesignation}",
  "empworkDetails":"${data.empworkDetails}",
  "apiType": "Android",
  "apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.editEmploymentUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public listsEmployeeEmployment(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
	"apiType": "Android",
	"apiVersion": "1.0"
}]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.employmentListsUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public deleteEmployeeEmployment(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
"languageID": "1",
"loginemployeeID": "${data.loginemployeeID}",
"apiType": "Android",
"empworkID":"${data.empworkID}",
"apiVersion": "1.0"
}]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.deleteEmploymentUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public addEmployeeEducation = (data: any) => {
    const form = new FormData();
    const fData = `[{
"languageID": "1",
"loginemployeeID": "${data.loginemployeeID}",
"degreeName": "${data.degreeName}",
"universityName": "${data.universityName}",
"specialisationName": "${data.specialisationName}",
"degreeID": "${data.degreeID}",
"universityID": "${data.universityID}",
"specialisationID": "${data.specialisationID}",
"empeducationYear": ${data.empeducationYear},
"empeducationPer": "${data.empeducationPer}",
"apiType": "Android",
"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.addEmployeeEducationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editEmployeeEducation = (data: any) => {
    const form = new FormData();
    const fData = `[{
"languageID": "1",
"empeducationID": "${data.empeducationID}",
"loginemployeeID": "${data.loginemployeeID}",
"degreeName": "${data.degreeName}",
"universityName": "${data.universityName}",
"specialisationName": "${data.specialisationName}",
"degreeID": "${data.degreeID}",
"universityID": "${data.universityID}",
"specialisationID": "${data.specialisationID}",
"empeducationYear": "${data.empeducationYear}",
"empeducationPer": "${data.empeducationPer}",
"apiType": "Android",
"apiVersion": "1.0"
 }]`;

    form.append('json', fData);
    return this.http
      .post<any>(this.editEmployeeEducationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public deleteEducation(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
"languageID": "1",
"empeducationID":"${data.empeducationID}",
"loginemployeeID": "${data.loginemployeeID}",
"apiType": "Android",
"apiVersion": "1.0"
  }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.deleteEmployeeEducationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public listsEducation(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
  "languageID": "1",
	"loginemployeeID": "${data.loginemployeeID}",
	"apiType": "Android",
	"apiVersion": "1.0"
}]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.listsEmployeeEducationUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public addSkill(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
      "languageID": "1",
      "loginemployeeID": "${data.loginemployeeID}",
      "skilldetails": ${JSON.stringify(data.skilldetails)},
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.addEmployeeSkillsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public editSkill(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"languageID": "1", "loginemployeeID": "' +
      data.loginemployeeID +
      '", "empskillID": "' +
      data.empskillID +
      '", "skillName": "' +
      data.skillName +
      '", "skillID": "' +
      data.skillID +
      '", "empworkprofileID": "' +
      data.empworkprofileID +
      '", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.editEmployeeSkillsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public listSkills(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"languageID": "1","loginemployeeID": "' +
      data.loginemployeeID +
      '","empskillID":"' +
      data.empskillID +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.listsEmployeeSkillsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public deleteSkill(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
      "languageID": "1",
      "loginemployeeID": "${data.loginemployeeID}",
      "empskillID":"${data.empskillID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.deleteEmployeeSkillsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getCountryLists(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{"loginuserID": "0",
      "searchWord":"${data.searchWord}",
      "apiType": "Android",
      "apiVersion": "1.0"}]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.countryListsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  public updateEmployeeResume(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"languageID": "' +
      data.languageID +
      '", "loginemployeeID": "' +
      data.loginemployeeID +
      '", "employeeResume": "' +
      data.employeeResume +
      '", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.updateResumeUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // getting state list
  public getStateLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      `[{"loginuserID": "0",
      "searchWord": "${data.searchWord}",
      "countryID": "${data.countryID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.stateListUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  get cities() {
    if (!this.cityLists$) {
      const data = {
        loginuserID: '',
        countryID: '0',
        stateID: '0',
        searchWord: '',
      };
      this.cityLists$ = this.getCityLists(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.cityLists$;
  }
  public getCityLists(data: any): Observable<any> {
    const form = new FormData();
    const fData =
      `[{"loginuserID": "0",
      "searchWord":"${data.searchWord}",
      "countryID":"${data.countryID}",
      "stateID":"${data.stateID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.cityListsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  get availabe() {
    if (!this.availabeLists$) {
      const data = {
        searchWord: '',
      };
      this.availabeLists$ = this.getAvailableFromLists(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.availabeLists$;
  }
  public getAvailableFromLists(data: any): Observable<any> {
    const form = new FormData();
    const fData = `
    [{"loginuserID": "0",
    "searchWord":"${data.searchWord}",
    "apiType": "Android",
    "apiVersion": "1.0"}]
    `;
    form.append('json', fData);
    return this.http
      .post<any>(this.availableFromListUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }

  get notices() {
    if (!this.noticeLists$) {
      const data = {
        searchWord: '',
      };
      this.noticeLists$ = this.getNoticeLists(data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.noticeLists$;
  }
  public getNoticeLists(data: any): Observable<any> {
    const form = new FormData();
    const fData = `
    [{
    "loginuserID": "0",
    "searchWord":"${data.searchWord}",
    "apiType": "Android",
    "apiVersion": "1.0"
    }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.noticeListsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }
  // getting city list
  public getProofOfAddressLists(): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0", "searchWord":"", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.proofOfAddUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // getting city list
  public getProofOfIDLists(): Observable<any> {
    const form = new FormData();
    const fData =
      '[{"loginuserID": "0", "searchWord":"", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', fData);
    return this.http
      .post<any>(this.proofOfIDListsUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // getting city list
  get sallary() {
    if (!this.sallaryRangeLists$) {
      this.sallaryRangeLists$ = this.getSallaryRangeLists().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.sallaryRangeLists$;
  }
  public getSallaryRangeLists(): Observable<any> {
    const form = new FormData();
    const sallayRangeData =
      '[{"loginuserID": "0", "searchWord":"", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', sallayRangeData);
    return this.http
      .post<any>(this.sallaryRangeListsUrl, form, this.httpOptions)
      .pipe(map((response) => response[0].data), retry(1), catchError(this.handleError));
  }
  // uploading files
  public employeeUpdateProfilePicture(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
    "languageID": "1",
	  "loginemployeeID": "${data.loginemployeeID}",
	  "employeeProfilePicture": "${data.employeeProfilePicture}",
	  "apiType": "Android",
	  "apiVersion": "1.0"
  }]`;
    form.append('json', fData);
    return this.http
      .post<any>(this.employeeUpdateProfilePictureUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
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
        const percentDone = Math.round((100 * event.loaded) / event.total);
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
    const fData =
      '[{"loginuserID": "' +
      fileData.loginemployeeID +
      '", "apiType": "Android","apiVersion": "1.0"}]';
    const fileField = fileData.file;
    const filePath = fileData.filePath;
    form.append('json', fData);
    form.append('FileField', fileField);
    form.append('FilePath', filePath);
    return this.http
      .post<any>(this.fileUploadUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // candidate login
  public employeeUpdateProfile(data: any): Observable<any> {
    const form = new FormData();
    const loginData = `[{
"languageID": "1",
"loginemployeeID": "${data.loginemployeeID}",
"employeeName": "${data.employeeName}",
"employeeEmail":"${data.employeeEmail}",
"employeeDeviceType": "Android",
"employeeDeviceID": "57d0e7a3403b1107",
"employeeProfilePicture":"${data.employeeProfilePicture}",
"employeeDOB":"${data.employeeDOB}",
"employeeGender":"${data.employeeGender}",
"employeeCurrentAddress":"${data.employeeCurrentAddress}",
"employeePermanantAddress":"${data.employeePermanantAddress}",
"employeeMartialStatus":"${data.employeeMartialStatus}",
"apiType": "Android",
"apiVersion": "1.0"
}]`;
    form.append('json', loginData);
    return this.http
      .post<any>(this.employeeUpdateProfileUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // candidate registration
  public employeeBasicUpdate(data: any): Observable<any> {
    const form = new FormData();
    const basicUpdateData = `[{
      "languageID": "${data.languageID}",
      "loginemployeeID": "${data.loginemployeeID}",
      "employeeFirstname": "${data.employeeFirstname}",
      "employeeLastname": "${data.employeeLastname}",
      "empkycFresher": "${data.empkycFresher}",
      "empkycExpYear": "${data.empkycExpYear}",
      "empkycExpMonth": "${data.empkycExpMonth}",
      "empkycRelExpYear": "${data.empkycRelExpYear}",
      "empkycRelExpMonth": "${data.empkycRelExpMonth}",
      "empkycCTCPA": "${data.empkycCTCPA}",
      "empkycETCPA": "${data.empkycETCPA}",
      "noticeID": "${data.noticeID}",
      "avialablefromID": "${data.avialablefromID}",
      "empkycInterviewFrom": "${data.empkycInterviewFrom}",
      "empkycInterviewTo": "${data.empkycInterviewTo}",
      "proofidID": "${data.proofidID}",
      "empkycProofidImage": "${data.empkycProofidImage}",
      "empkycProofidNumber": "${data.empkycProofidNumber}",
      "proofaddID": "${data.proofaddID}",
      "empkycProofaddNumber": "${data.empkycProofaddNumber}",
      "empkycProofaddImage": "${data.empkycProofaddImage}",
      "empkycPassportImage": "${data.empkycPassportImage}",
      "empkycWorkPermitCountryID": "${data.empkycWorkPermitCountryID}",
      "empkycWorkPermittTill": "${data.empkycWorkPermittTill}",
      "countryID": "${data.countryID}",
      "stateID": "${data.stateID}",
      "cityID": "${data.cityID}",
      "empkycCTCPACurrency": "${data.empkycCTCPACurrency}",
      "empkycETCPACurrency": "${data.empkycETCPACurrency}",
      "apiType":"Android",
      "apiVersion":"1.0"
    }]`;
    form.append('json', basicUpdateData);
    return this.http
      .post<any>(this.employeeKycAddUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // re-schedule interview by candidate
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
  // candidate interview-request, re-scheduled, declined and process
  public employeeInterviewStatus(data: any): Observable<any> {
    const form = new FormData();
    const interviewData = `[{
        "languageID": "${data.languageID}",
        "employeeID": "${data.employeeID}",
        "page": "0",
        "pagesize": "100",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', interviewData);
    return this.http
      .post<any>(this.employeeInterviewRequestsUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // candidate interview listing api
  public interviewsRequest(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // candidate interview listing api
  public interviewsScheduled(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // candidate interview listing api
  public interviewsRescheduled(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // candidate interview listing api
  public interviewsDecline(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public employeeInterviewsSelected = (data: any) => {
    if (!this.getListsSelected$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.getListsSelected$ = timer$.pipe(
        switchMap((_) => this.InterviewsSelected(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.getListsSelected$;
  }
  // candidate interview listing api
  public InterviewsSelected(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public employeeInterviewsJobDeclined = (data: any) => {
    if (!this.getListsJobDeclinedByCandidate$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.getListsJobDeclinedByCandidate$ = timer$.pipe(
        switchMap((_) => this.interviewsJobDeclined(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.getListsJobDeclinedByCandidate$;
  }
  // candidate interview listing api
  public interviewsJobDeclined(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public employeeInterviewsRejected = (data: any) => {
    if (!this.getListsRejected$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.getListsRejected$ = timer$.pipe(
        switchMap((_) => this.interviewsRejected(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.getListsRejected$;
  }
  // candidate interview listing api
  public interviewsRejected(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public employeeInterviewsInterviewed = (data: any) => {
    if (!this.getListsInterviewed$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.getListsInterviewed$ = timer$.pipe(
        switchMap((_) => this.interviewsInterviewed(data)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.getListsInterviewed$;
  }
  // candidate interview listing api
  public interviewsInterviewed(data: any): Observable<any> {
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
      .post<any>(this.employeeInterviewsListingUrl, form, this.httpOptions)
      .pipe(retry(2), shareReplay(CACHE_SIZE), catchError(this.handleError));
  }
  // getting interview status list
  public getInterviewStatusLists(): Observable<any> {
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

  get getInterviewReasonsLists() {
    if (!this.getListsReasons$) {
      this.getListsReasons$ = this.reasonsLists().pipe(shareReplay(CACHE_SIZE));
    }
    return this.getListsReasons$;
  }
  // getting interview reject reasons list
  public reasonsLists(): Observable<any> {
    const form = new FormData();
    const reasonData = `[{
      "loginuserID": "0",
      "searchWord":"",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', reasonData);
    return this.http
      .post<any>(this.reasonListSUrl, form, this.httpOptions)
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
}
