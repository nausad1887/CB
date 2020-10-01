import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { HomeService } from 'src/app/home.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employment-modal',
  templateUrl: './employment-modal.component.html',
  styleUrls: ['./employment-modal.component.css'],
})
export class EmploymentModalComponent implements OnInit {
  @Input() addEmployment: boolean;
  @Input() editEmployment: boolean;
  @Input() editableEmploymentData: any;
  public selectedFromDates = [];
  public selectedToDates = [];
  public employeeData: any;
  public industriesLists = [];
  public companiesLists = [];
  public filteredCompanyList = [];
  public years: number[] = [];
  private yy: number;
  public selectedFromMonth: string;
  public selectedFromYear: string;
  public selectedToMonth: string;
  public selectedToYear: string;
  public currentCompany = false;
  public currentCompanyNot = true;
  public addAndEditEmployeeEmploymentData = {
    loginemployeeID: '', // mandatory
    empworkID: '',
    countryName: '',
    regionName: '',
    industryName: '', // mandatory
    ownershipName: '',
    companyName: '', // mandatory
    companyID: '', // mandatory
    regionID: '',
    ownershipID: '',
    industryID: '', // mandatory
    empworkFrom: '', // mandatory
    empworkTo: '', // mandatory
    empworkDesignation: '', // mandatory
    empworkDetails: '', // mandatory
  };
  months = [
    { val: '01', name: 'Jan' },
    { val: '02', name: 'Feb' },
    { val: '03', name: 'Mar' },
    { val: '04', name: 'Apr' },
    { val: '05', name: 'May' },
    { val: '06', name: 'Jun' },
    { val: '07', name: 'Jul' },
    { val: '08', name: 'Aug' },
    { val: '09', name: 'Sep' },
    { val: '10', name: 'Oct' },
    { val: '11', name: 'Nov' },
    { val: '12', name: 'Dec' },
  ];

  constructor(
    public candidateService: CandidateService,
    public homeService: HomeService,
    public activeModal: NgbActiveModal,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (this.editableEmploymentData) {
      this.addAndEditEmployeeEmploymentData.industryID = this.editableEmploymentData.industryID;
      this.addAndEditEmployeeEmploymentData.industryName = this.editableEmploymentData.industryName;
      this.addAndEditEmployeeEmploymentData.companyID = this.editableEmploymentData.companyID;
      this.addAndEditEmployeeEmploymentData.companyName = this.editableEmploymentData.companyName;
      this.addAndEditEmployeeEmploymentData.empworkDesignation = this.editableEmploymentData.empworkDesignation;
      this.addAndEditEmployeeEmploymentData.empworkDetails = this.editableEmploymentData.empworkDetails;
      this.addAndEditEmployeeEmploymentData.empworkFrom = this.editableEmploymentData.empworkFrom;
      this.addAndEditEmployeeEmploymentData.empworkTo =
        this.editableEmploymentData.empworkTo !== 'undefined, undefined'
          ? this.editableEmploymentData.empworkTo
          : '';
      this.addAndEditEmployeeEmploymentData.empworkID = this.editableEmploymentData.empworkID;
      this.selectedFromDates = this.addAndEditEmployeeEmploymentData.empworkFrom.split(
        ', '
      );
      this.selectedFromMonth = this.selectedFromDates[0];
      this.selectedFromYear = this.selectedFromDates[1];
      this.addAndEditEmployeeEmploymentData.empworkTo
        ? (this.selectedToDates = this.addAndEditEmployeeEmploymentData.empworkTo.split(
            ', '
          ))
        : (this.currentCompanyNot = true);
      this.currentCompany = false;
      this.selectedToMonth = this.selectedToDates[0];
      this.selectedToYear = this.selectedToDates[1];
    }
    this.checkStatus();
    this.getIndustriesLists();
    this.getCompaniesLists();
    this.getYear();
  }

  public isTrue = () => {
    this.currentCompany = true;
    this.currentCompanyNot = false;
    this.selectedToYear = undefined;
    this.selectedToMonth = undefined;
  }

  public isFalse = () => {
    this.currentCompany = false;
    this.currentCompanyNot = true;
  }

  public checkStatus = () => {
    if (!this.homeService.getCurrentUserFromLocalStorage()) {
      this.employeeData = this.homeService.getCurrentUserFromSessionStorage();
    } else {
      this.employeeData = this.homeService.getCurrentUserFromLocalStorage();
    }
  }

  public onChangeEditFromMonth = (month: any) => {
    if (month === null || month === undefined || month === '') {
      this.selectedFromMonth = '';
    } else {
      this.selectedFromMonth = month;
    }
  }

  public onChangeEditToMonth = (month: any) => {
    if (month === null || month === undefined || month === '') {
      this.selectedFromMonth = '';
    } else {
      this.selectedToMonth = month;
    }
  }

  public onChangeFromMonth = (month: any) => {
    if (month === null || month === undefined || month === '') {
      this.selectedFromMonth = '';
    } else {
      this.months.map((smonth) => {
        if (smonth.val === month) {
          this.selectedFromMonth = smonth.name;
        }
      });
    }
  }
  public onChangeFromYear = (year: any) => {
    if (year === null || year === undefined || year === '') {
      this.selectedFromYear = '';
    } else {
      this.selectedFromYear = year;
    }
  }
  public onChangeToMonth = (month: any) => {
    if (month === null || month === undefined || month === '') {
      this.selectedToMonth = '';
    } else {
      this.months.map((sMonth) => {
        if (sMonth.val === month) {
          this.selectedToMonth = sMonth.name;
        }
      });
    }
  }
  public onChangeToYear = (year: any) => {
    if (year === null || year === undefined || year === '') {
      this.selectedToYear = '';
    } else {
      this.selectedToYear = year;
    }
  }

  public getYear() {
    const today = new Date();
    this.yy = today.getFullYear();
    for (let i = this.yy - 20; i <= this.yy; i++) {
      this.years.push(i);
    }
  }

  public onChangeIndustry = (industryID: string) => {
    if (industryID === null || industryID === undefined || industryID === '') {
      this.addAndEditEmployeeEmploymentData.industryID = '';
      this.addAndEditEmployeeEmploymentData.industryName = '';
    } else {
      this.industriesLists.map((industry) => {
        if (industry.industryID === industryID) {
          this.addAndEditEmployeeEmploymentData.industryID = industryID;
          this.addAndEditEmployeeEmploymentData.industryName =
            industry.industryName;
        }
      });
    }
  }

  public onChangeCompany = (companyID: string) => {
    if (companyID === null || companyID === undefined || companyID === '') {
      this.addAndEditEmployeeEmploymentData.companyID = '';
      this.addAndEditEmployeeEmploymentData.companyName = '';
    } else {
      this.companiesLists.map((company) => {
        if (company.companyID === companyID) {
          this.addAndEditEmployeeEmploymentData.companyName =
            company.companyName;
          this.addAndEditEmployeeEmploymentData.companyID = company.companyID;
        }
      });
    }
  }

  public onCloseModal = () => {
    this.activeModal.close();
  }

  public getIndustriesLists = () => {
    const data = {searchWord: ''};
    this.candidateService.getIndustryLists(data).subscribe(
      (response) => {
        if (response.length > 0) {
          this.industriesLists = response;
          this.industriesLists.sort((a, b) => {
            const nameA = a.industryName.toUpperCase();
            const nameB = b.industryName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.industriesLists = this.industriesLists.filter(
            (industry) => industry.industryName !== ''
          );
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public getCompaniesLists = () => {
    const data = {searchWord: ''};
    this.candidateService.getCompanyLists(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.companiesLists = response[0].data;
          this.companiesLists.sort((a, b) => {
            const nameA = a.companyName.toUpperCase();
            const nameB = b.companyName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.companiesLists = this.companiesLists.filter(
            (company) => company.companyName !== ''
          );
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public concatnateSpaceAndComaBetweenTwoString(str1: string, str2: string) {
    const res = str1 + ', ' + str2;
    return res;
  }

  public onSubmitAddEmployment = () => {
    if (
      this.selectedToMonth === '' ||
      this.selectedToMonth === null ||
      this.selectedToMonth === undefined ||
      this.selectedToYear === null ||
      this.selectedToYear === undefined ||
      this.selectedToYear === ''
    ) {
      this.addAndEditEmployeeEmploymentData.empworkFrom = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedFromMonth,
        this.selectedFromYear
      );
    } else {
      this.addAndEditEmployeeEmploymentData.empworkFrom = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedFromMonth,
        this.selectedFromYear
      );
      this.addAndEditEmployeeEmploymentData.empworkTo = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedToMonth,
        this.selectedToYear
      );
    }
    this.addAndEditEmployeeEmploymentData.loginemployeeID = this.employeeData.employeeID;
    if (!this.addAndEditEmployeeEmploymentData.industryID) {
      this.toastr.warningToastr('Select Industry');
    } else if (!this.addAndEditEmployeeEmploymentData.companyID) {
      this.toastr.warningToastr('Select Company');
    } else if (!this.addAndEditEmployeeEmploymentData.empworkDesignation) {
      this.toastr.warningToastr('Enter Designation');
    } else {
      this.spinner.show();
      this.candidateService
        .addEmployeeEmployment(this.addAndEditEmployeeEmploymentData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              setTimeout(() => {
                this.spinner.hide();
                this.activeModal.close();
              }, 1500);
            } else {
              this.spinner.hide();
              console.error(response[0].message);
            }
          },
          (error) => {
            this.spinner.hide();
            console.error(error);
          }
        );
    }
  }

  public isEmpty(str: string) {
    return !str || 0 === str.length || str === undefined || str === '';
  }

  public onSubmitEditEmployment = (editForm: NgForm) => {
    if (
      this.isEmpty(this.selectedToYear) &&
      this.isEmpty(this.selectedToMonth) &&
      this.selectedToMonth === undefined &&
      this.selectedToYear === undefined
    ) {
      this.addAndEditEmployeeEmploymentData.empworkTo = '';
      this.addAndEditEmployeeEmploymentData.empworkFrom = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedFromMonth,
        this.selectedFromYear
      );
    } else {
      this.addAndEditEmployeeEmploymentData.empworkFrom = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedFromMonth,
        this.selectedFromYear
      );
      this.addAndEditEmployeeEmploymentData.empworkTo = this.concatnateSpaceAndComaBetweenTwoString(
        this.selectedToMonth,
        this.selectedToYear
      );
    }
    this.addAndEditEmployeeEmploymentData.loginemployeeID = this.employeeData.employeeID;
    if (!this.addAndEditEmployeeEmploymentData.industryID) {
      this.toastr.warningToastr('Select Industry');
    } else if (!this.addAndEditEmployeeEmploymentData.companyID) {
      this.toastr.warningToastr('Select Company');
    } else if (!this.addAndEditEmployeeEmploymentData.empworkDesignation) {
      this.toastr.warningToastr('Enter Designation');
    } else {
      this.spinner.show();
      this.candidateService
        .editEmployeeEmployment(this.addAndEditEmployeeEmploymentData)
        .subscribe(
          (response) => {
            if (response[0].status === 'true') {
              this.updateData(response[0].data);
              setTimeout(() => {
                editForm.resetForm();
                this.spinner.hide();
                this.activeModal.close();
              }, 1500);
            } else {
              this.spinner.hide();
              console.error(response[0].message);
            }
          },
          (error) => {
            this.spinner.hide();
            console.error(error);
          }
        );
    }
  }

  public onDeleteEmployment = (empworkID: string) => {
    this.spinner.show();
    const data = {
      loginemployeeID: this.employeeData.employeeID,
      empworkID,
    };
    this.candidateService.deleteEmployeeEmployment(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.updateData(response[0].data);
          this.toastr.successToastr('Removed');
          setTimeout(() => {
            this.spinner.hide();
            this.activeModal.close();
          }, 1500);
        } else {
          this.spinner.hide();
          console.error(response[0].message);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }

  public updateData = (data: any) => {
    this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.setCurrentUserInLocalStorage(data[0])
      : this.homeService.setCurrentUserInSessionStorage(data[0]);
    setTimeout(() => {
      this.checkStatus();
    }, 500);
  }
}
