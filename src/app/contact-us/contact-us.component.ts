import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  public cmsData = [];
  public cmsContent: string;
  public cmsName: string;
  private cmsPageData = {
    loginuserID: '',
    languageID: '1',
    cmspageName: 'Contact Us',
  };
  constructor(
    public candidateService: HomeService,
    public toastr: ToastrManager
  ) {}

  ngOnInit(): void {}

  public getCmsPage = () => {
    const data = {
      loginuserID: this.cmsPageData.loginuserID,
      languageID: this.cmsPageData.languageID,
      cmspageName: this.cmsPageData.cmspageName,
    };
    this.candidateService.getCmsPage(data).subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.cmsData = response[0].data;
          this.cmsName = response[0].data[0].cmspageName;
          this.cmsContent = response[0].data[0].cmspageContents;
          console.log(this.cmsData);
        } else {
          this.toastr.errorToastr(response[0].message, 'error');
        }
      },
      (error) => {
        this.toastr.errorToastr('some error occured');
      }
    );
  };
}
