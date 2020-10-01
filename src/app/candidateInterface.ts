export interface CandidateRegistration {
  languageID: string;
  employeeCountryCode: string;
  employeeMobile: string;
  employeeName: string;
  employeeEmail: string;
  employeePassword: string;
}
export interface EmployerRegistration {
  languageID: string;
  employerCountryCode: string;
  employerMobile: string;
  employerCompany: string;
  employerEmail: string;
  employerPassword: string;
  employerContactName: string;
  employerContactCountryCode: string;
  employerContactMobile: string;
  employerDesignation: string;
}
export interface CandidateLogin {
  languageID: string;
  employeeMobile: string;
  employeePassword: string;
}
export interface EmployerLogin {
  languageID: string;
  employerMobile: string;
  employerPassword: string;
}
export interface KycDetails {
  languageID: string;
  loginemployeeID: string;
  employeeFirstname: string;
  employeeLastname: string;
  empkycFresher: string;
  empkycExpYear: string;
  empkycExpMonth: string;
  empkycRelExpYear: string;
  empkycRelExpMonth: string;
  empkycCTCPA: string;
  empkycETCPA: string;
  noticeID: string;
  avialablefromID: string;
  empkycInterviewFrom: string;
  empkycInterviewTo: string;
  proofidID: string;
  empkycProofidImage: string;
  empkycProofidNumber: string;
  proofaddID: string;
  empkycProofaddNumber: string;
  empkycProofaddImage: string;
  empkycPassportImage: string;
  empkycWorkPermitCountryID: string;
  empkycWorkPermittTill: string;
  countryID: string;
  stateID: string;
  cityID: string;
  empkycCTCPACurrency: string;
  empkycETCPACurrency: string;
}

export interface StateListData {
  countryID: string;
  searchWord: string;
}

export interface CityListsDate {
  loginuserID: string;
  countryID: string;
  stateID: string;
  searchWord: string;
}

export interface EmployeeData {
  loginuserID: string;
  countryID: string;
  stateID: string;
  searchWord: string;
}
export interface UploadFileData {
  file: File;
  fileName: string;
  filePath: number;
  loginemployeeID: number;
}

export interface UploadFileDataEmployer {
  file: File;
  fileName: string;
  filePath: number;
  loginemployerID: number;
}

export interface Candidate {
  employeeID: '';
  employeeName: '';
  employeeEmail: '';
  employeeCountryCode: '';
  employeeMobile: '';
  employeeMobileVerified: '';
  employeeEmailVerified: '';
  employeeDOB: '';
  employeeGender: '';
  employeeCurrentAddress: '';
  employeePermanantAddress: '';
  employeeMartialStatus: '';
  employeeProfilePicture: '';
  employeeResume: '';
  employeeResumeUpdated: '';
  employeeProfileProgress: '';
  employeeFBID: '';
  employeeGoogleID: '';
  employeeLinkedinID: '';
  employeeNotifyJobStatus: '';
  employeeNotifyNewInterview: '';
  employeeNotifyAdminResponse: '';
  employeeReferCode: '';
  employeeSignupRef: '';
  employeeProfileVisibleFrom: '';
  employeeServiceNotice: '';
  employeeStatus: '';
  employeeSendAdminApproval: '';
  cityName: '';
  countryName: '';
  stateName: '';
  employeeeducation: [];
  employeeskill: [];
  awards: [];
  workprofiles: [];
  certificates: [];
  employeework: [];
  kycinfo: [];
  languages: [];
}

export interface SearchJDdata {
  languageID: string;
  loginemployerID: string;
  skillIDs: string;
  empworkDesignation: string;
  jobjdName: string;
  cityID: string;
  minval: string;
  maxval: string;
  expMinVal: string;
  expMaxVal: string;
  empcertificateName: string;
  noticeID: string;
  emplanguageName: string;
  empkycExpYear: string;
  degreeID: string;
  industryIDs: string;
  noticeIDs: string;
  regionIDs: string;
  countryIDs: string;
  cityIDs: string;
  avialablefromIDs: string;
  emplanguageNames: string;
  degreeIDs: string;
  cvduration: string;
}

export interface City {
  status: string;
  message: string;
  cityID: string;
  data: Array<string>;
}
export interface Notice {
  status: string;
  message: string;
  noticeID: string;
  data: Array<string>;
}
export interface Availabe {
  status: string;
  message: string;
  availableID: string;
  data: Array<string>;
}
export interface Skill {
  status: string;
  message: string;
  skillID: string;
  data: Array<any>;
}
export interface AddSkillsData {
  loginemployeeID: string;
  skilldetails: Array<any>;
}
export interface Interview {
  interviewID: string;
  message: string;
  status: string;
  data: Array<any>;
}
