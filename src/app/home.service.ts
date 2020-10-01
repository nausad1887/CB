import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CandidateRegistration, CandidateLogin, EmployerLogin, EmployerRegistration } from './candidateInterface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private registrationUrl = '/employee/employee-signup';
  private loginUrl = '/employee/employee-login-password';
  private cmsPageUrl = '/cmspage/get-cmspage';
  private languageUrl = '/language/get-language-list';
  private employeeOtpVerificationUrl = '/employee/otp-verification';
  private employeeResendOtpUrl = '/employee/otp-resend';
  private changePasswordUrl = '/employee/change-password';
  private forgetPasswordUrl = '/employee/employee-forgot-password';
  private resetPasswordUrl = '/employee/reset-password';
  private checkEmployeeDuplicationUrl = '/employee/check-employee-duplication';
  private employerSignUpUrl = '/employer/employer-signup';
  private employerLoginUrl = '/employer/employer-login-password';
  private employerOtpVerificationUrl = '/employer/otp-verification';
  private employerResendOtpUrl = '/employer/otp-resend';
  private employerForgetPasswordUrl = '/employer/employer-forgot-password';
  private employerResetPasswordUrl = '/employer/reset-password';
  private employerChangePasswordUrl = '/employer/change-password';
  private employerEmailOtpVerificationUrl = '/employer/email-otp-verification';
  private employerEmailResendOtpUrl = '/employer/email-otp-resend';
  private checkEmployerDuplicationUrl = '/employer/check-employer-duplication';

  // candidate Subject
  public isCandidate: false;
  update: BehaviorSubject<boolean>;

  // employer Subject
  public isEmployer: false;
  updateEmployer: BehaviorSubject<boolean>;

  public languageID: number;
  updatedLanguageID: BehaviorSubject<number>;

  constructor(public http: HttpClient) {
    this.update = new BehaviorSubject(this.isCandidate);
    this.updateEmployer = new BehaviorSubject(this.isEmployer);
    this.updatedLanguageID = new BehaviorSubject(this.languageID);
  }

  httpOptions = {
    headers: new HttpHeaders({}),
  };
  public isCandidateTrue = (isTrue: boolean) => {
    this.update.next(isTrue);
  }
  public isEmployerTrue = (isTrue: boolean) => {
    this.updateEmployer.next(isTrue);
  }
  public setCurrentUserInLocalStorage = (data: any) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  public setCurrentUserInSessionStorage = (data: any) => {
    sessionStorage.setItem('currentUser', JSON.stringify(data));
  }
  public getCurrentUserFromSessionStorage = () => {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }
  public getCurrentUserFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  public removeSessionStorage = () => {
    sessionStorage.removeItem('currentUser');
  }
  public removeLocalStorage = () => {
    localStorage.removeItem('currentUser');
  }
  public setCurrentEmployerInLocalStorage = (data: any) => {
    localStorage.setItem('currentEmployer', JSON.stringify(data));
  }
  public setCurrentEmployerInSessionStorage = (data: any) => {
    sessionStorage.setItem('currentEmployer', JSON.stringify(data));
  }
  public getCurrentEmployerFromSessionStorage = () => {
    return JSON.parse(sessionStorage.getItem('currentEmployer'));
  }
  public getCurrentEmployerFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('currentEmployer'));
  }
  public removeEmployerSessionStorage = () => {
    sessionStorage.removeItem('currentEmployer');
  }
  public removeEmployerLocalStorage = () => {
    localStorage.removeItem('currentEmployer');
  }
  public nextLanguageID(languageID: number) {
    this.updatedLanguageID.next(languageID);
  }

  // get cms-Page
  public getCmsPage(data: any): Observable<any> {
    const form = new FormData();
    const post =
      '[{"loginuserID": "' +
      data.loginuserID +
      '","languageID": "' +
      data.languageID +
      '","cmspageName": "' +
      data.cmspageName +
      '","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', post);
    return this.http
      .post<any>(this.cmsPageUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // getting language list
  public getLanguageList(): Observable<any> {
    const form = new FormData();
    const x = '[{"loginuserID": "0","apiType": "Android","apiVersion": "1.0"}]';
    form.append('json', x);
    return this.http
      .post<any>(this.languageUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // candidate login
  public login(data: any): Observable<any> {
    const form = new FormData();
    const loginData =
      '[{"employeePassword": "' +
      data.employeePassword +
      '", "employeeMobile": "' +
      data.employeeMobile +
      '","languageID": "' +
      data.languageID +
      '", "employeeDeviceID": "token", "apiType": "Android", "apiVersion": "1.0"}]';
    form.append('json', loginData);
    return this.http
      .post<CandidateLogin[]>(this.loginUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // candidate forget password
  public employeeForgetPassword(data: any): Observable<any> {
    const form = new FormData();
    const forgetData = `[{
        "employeeCountryCode": "91",
        "languageID": "1",
        "employeeMobile": "${data.employeeMobile}",
        "employeeEmail":"${data.employeeEmail}",
        "apiType": "Android",
        "apiVersion": "1.0"
       }]`;
    form.append('json', forgetData);
    return this.http
      .post<any>(this.forgetPasswordUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // candidate reset password
  public employeeResetPassword(data: any): Observable<any> {
    const form = new FormData();
    const resetData = `[{
        "loginemployeeID": "${data.loginemployeeID}",
	      "languageID": "1",
	      "employeeNewPassword": "${data.employeeNewPassword}",
	      "apiType": "Android",
	      "apiVersion": "1.0"
       }]`;
    form.append('json', resetData);
    return this.http
      .post<any>(this.resetPasswordUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // candidate change password
  public employeeChangePassword(data: any): Observable<any> {
    const form = new FormData();
    const changePasswordData = `[{
        "loginemployeeID": "${data.loginemployeeID}",
        "employeeCurrentPassword": "${data.employeeCurrentPassword}",
        "languageID": "${data.languageID}",
        "employeeNewPassword": "${data.employeeNewPassword}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', changePasswordData);
    return this.http
      .post<any>(this.changePasswordUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // candidate verification
  public employeeVerification(data: any): Observable<any> {
    const form = new FormData();
    const verifyData = `[{
        "languageID": "1",
        "loginemployeeID": "${data.loginemployeeID}",
        "employeeOTP":"${data.employeeOTP}",
        "employeeDeviceID": "XCVXCVCCVSCSSDSDDD",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', verifyData);
    return this.http
      .post<any>(this.employeeOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // candidate resend otp
  public employeeResendOtp(data: any): Observable<any> {
    const form = new FormData();
    const otpResendData = `[{
        "languageID": "1",
        "loginemployeeID": "${data.loginemployeeID}",
        "employeeMobile":"${data.employeeMobile}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', otpResendData);
    return this.http
      .post<any>(this.employeeResendOtpUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer Login
  public employerLogin(data: any): Observable<any> {
    const form = new FormData();
    const loginData = `[{
        "employerPassword": "${data.employerPassword}",
        "employerMobile": "${data.employerMobile}",
        "languageID": "${data.languageID}",
        "employerDeviceID": "token",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', loginData);
    return this.http
      .post<EmployerLogin[]>(this.employerLoginUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // employer verification
  public employerVerification(data: any): Observable<any> {
    const form = new FormData();
    const verifyData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerOTP":"${data.employerOTP}",
      "employerDeviceID": "XCVXCVCCVSCSSDSDDD",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', verifyData);
    return this.http
      .post<any>(this.employerOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer resend otp
  public employerResendOtp(data: any): Observable<any> {
    const form = new FormData();
    const otpResendData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerMobile":"${data.employerMobile}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', otpResendData);
    return this.http
      .post<any>(this.employerResendOtpUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // candidate registration
  public registration(data: any): Observable<any> {
    const form = new FormData();
    const registrationData =
      '[{"languageID": "' +
      data.languageID +
      '","employeeCountryCode": "' +
      data.employeeCountryCode +
      '","employeeMobile": "' +
      data.employeeMobile +
      '","employeeName": "' +
      data.employeeName +
      '", "employeeEmail":"' +
      data.employeeEmail +
      '","employeePassword":"' +
      data.employeePassword +
      '","employeeDeviceType": "Android", "employeeDeviceID": "57d0e7a3403b1107", "apiType": "Android","apiVersion": "1.0", "employeeLinkedinID": "", "employeeGoogleID": "", "employeeFBID": "fbid", "employeeSignupRef":"4CLODL"}]';
    form.append('json', registrationData);
    return this.http
      .post<CandidateRegistration[]>(
        this.registrationUrl,
        form,
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  // check employee duplication
  public checkEmployeeDuplication(data: any): Observable<any> {
    const form = new FormData();
    const checkData = `[{
      "loginemployeeID": "0",
      "employeeEmail": "${data.employeeEmail}",
      "employeeMobile": "${data.employeeMobile}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', checkData);
    return this.http
      .post<any>(this.checkEmployeeDuplicationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer registration
  public employerRegistration(data: any): Observable<any> {
    const form = new FormData();
    const registrationData = `[{
      "languageID": "${data.languageID}",
      "employerCountryCode":"${data.employerCountryCode}",
      "employerMobile":"${data.employerMobile}",
      "employerDeviceType":"Android",
      "employerDeviceID":"device token",
      "employerCompany":"${data.employerCompany}",
      "employerEmail":"${data.employerEmail}",
      "employerPassword":"${data.employerPassword}",
      "employerContactName":"${data.employerContactName}",
      "employerContactCountryCode":"${data.employerContactCountryCode}",
      "employerContactMobile":"${data.employerContactMobile}",
      "employerDesignation":"${data.employerDesignation}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', registrationData);
    return this.http
      .post<EmployerRegistration[]>(
        this.employerSignUpUrl,
        form,
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer forget password
  public employerForgetPassword(data: any): Observable<any> {
    const form = new FormData();
    const forgetData = `[{
      "employerCountryCode": "${data.employerCountryCode}",
      "languageID": "${data.languageID}",
      "employerMobile": "${data.employerMobile}",
      "employerEmail":"${data.employerEmail}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', forgetData);
    return this.http
      .post<any>(this.employerForgetPasswordUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // employer reset password
  public employerResetPassword(data: any): Observable<any> {
    const form = new FormData();
    const resetData = `[{
      "loginemployerID": "${data.loginemployerID}",
      "languageID": "${data.languageID}",
      "employerNewPassword": "${data.employerNewPassword}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', resetData);
    return this.http
      .post<any>(this.employerResetPasswordUrl, form, this.httpOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  // employer change password
  public employerChangePassword(data: any): Observable<any> {
    const form = new FormData();
    const changePasswordData = `[{
      "loginemployerID": "${data.loginemployerID}",
      "employerCurrentPassword": "${data.employerCurrentPassword}",
      "languageID": "${data.languageID}",
      "employerNewPassword": "${data.employerNewPassword}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', changePasswordData);
    return this.http
      .post<any>(this.employerChangePasswordUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer email verification
  public employerEmailVerification(data: any): Observable<any> {
    const form = new FormData();
    const verifyData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerEmailOTP":"${data.employerEmailOTP}",
      "employerDeviceID": "XCVXCVCCVSCSSDSDDD",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', verifyData);
    return this.http
      .post<any>(this.employerEmailOtpVerificationUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // employer email resend otp
  public employerEmailResendOtp(data: any): Observable<any> {
    const form = new FormData();
    const otpResendData = `[{
      "languageID": "${data.languageID}",
      "loginemployerID": "${data.loginemployerID}",
      "employerEmail":"${data.employerEmail}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', otpResendData);
    return this.http
      .post<any>(this.employerEmailResendOtpUrl, form, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  // check employer duplication
  public checkEmployerDuplication(data: any): Observable<any> {
    const form = new FormData();
    const checkData = `[{
      "loginemployerID": "0",
      "employerEmail": "${data.employerEmail}",
      "employerMobile": "${data.employerMobile}",
      "languageID": "${data.languageID}",
      "apiType": "Android",
      "apiVersion": "1.0"
    }]`;
    form.append('json', checkData);
    return this.http
      .post<any>(this.checkEmployerDuplicationUrl, form, this.httpOptions)
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
