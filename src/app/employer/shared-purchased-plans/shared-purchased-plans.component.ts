import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-purchased-plans',
  templateUrl: './shared-purchased-plans.component.html',
  styleUrls: ['./shared-purchased-plans.component.css'],
})
export class SharedPurchasedPlansComponent implements OnInit {
  @Input() emplrplanID: string;
  @Input() planID: string;
  @Input() emplrplanPrice: string;
  @Input() emplrplanView: string;
  @Input() emplrplanDownload: string;
  @Input() emplrplanViewBalance: string;
  @Input() emplrplanDownloadBalance: string;
  @Input() emplrplanValidDays: string;
  @Input() emplrplanEndDate: string;
  @Input() planName: string;
  public accessedemplrplanView: number;
  public accessedemplrplanDownload: number;
  public remainingDaysToExp: number;
  constructor() {}

  ngOnInit(): void {
    this.remainingDaysToExp = this.getRemainingDays(this.emplrplanEndDate);
    this.accessedemplrplanView = this.getemplrplanViewAccessed(this.emplrplanView, this.emplrplanViewBalance);
    this.accessedemplrplanDownload = this.getemplrplanViewBalanceAccessed(this.emplrplanDownload, this.emplrplanDownloadBalance);
  }

  public getemplrplanViewAccessed = (emplrplanView: string, emplrplanViewBalance: string) =>
  {
    return +emplrplanView - +emplrplanViewBalance;
  }
  public getemplrplanViewBalanceAccessed = (emplrplanDownload: string, emplrplanDownloadBalance: string) =>
  {
    return +emplrplanDownload - +emplrplanDownloadBalance;
  }

  public getRemainingDays = (emplrplanEndDate: string) => {
    const planEndDate = new Date(emplrplanEndDate);
    const currentDate = new Date(); // current date
    if (planEndDate.getTime() <= currentDate.getTime()) {
      return 0;
    } else {
      const diffTime = Math.abs(+currentDate - +planEndDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  }
}
