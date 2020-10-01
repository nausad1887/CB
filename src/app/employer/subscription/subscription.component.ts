import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home.service';
import { EmployerService } from '../employer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
})
export class SubscriptionComponent implements OnInit {
  public show = 2;
  public loadingUserSubscription = false;
  public noRecordFoundUserSubscription = false;
  public employerData: any;
  public plansLists = [];
  public purchasedPlansLists = [];
  plansLists$: Observable<Array<any>>;
  purchasedPlansLists$: Observable<Array<any>>;
  constructor(
    public homeService: HomeService,
    public employerService: EmployerService
  ) { }

  ngOnInit(): void {
    this.loadingUserSubscription = true;
    this.employerData = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    this.getPurchasedPlans().then((success: Array<any>) => {
      if (success.length > 0){
          this.purchasedPlansLists = success;
          this.purchasedPlansLists.sort((a, b) => {
            a.statusDate = new Date(a.emplrplanCreatedDate);
            b.statusDate = new Date(b.emplrplanCreatedDate);
            if (a.statusDate.getTime() < b.statusDate.getTime()) {return -1; }
            if (a.statusDate.getTime() > b.statusDate.getTime()) {return 1; }
            return 0;
          });
          this.loadingUserSubscription = false;
          this.purchasedPlansLists.reverse();
      }else{
          this.purchasedPlansLists = [];
          this.loadingUserSubscription = false;
          this.noRecordFoundUserSubscription = true;
      }
    }).catch((error) => {
        this.loadingUserSubscription = false;
        console.error(error);
    });
    this.getPlans();
  }

  public getPurchasedPlans = () => {
    return new Promise((resolve, reject) => {
    const data = {languageID: '1', loginemployerID: this.employerData.employerID};
    this.purchasedPlansLists$ = this.employerService.getPurchasedPlansLists(data);
    this.purchasedPlansLists$.subscribe((response) => {
      if (response[0].status === 'true') {resolve(response[0].data); } else {resolve([]); }},
      (error) => {reject(error); });
    });
  }

  public getPlans = () => {
    const data = {languageID: '1', loginemployerID: this.employerData.employerID};
    this.plansLists$ = this.employerService.getPlansLists(data);
  }
}
