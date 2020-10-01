import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-plans',
  templateUrl: './shared-plans.component.html',
  styleUrls: ['./shared-plans.component.css'],
})
export class SharedPlansComponent implements OnInit {
  @Input() planName: string;
  @Input() planID: string;
  @Input() planValidity: string;
  @Input() planPrice: string;
  @Input() planCurrency: string;
  @Input() planView: string;
  @Input() planDownload: string;
  @Input() planDiscountedPrice: string;
  @Input() planDiscountedCurrency: string;
  @Input() planDiscounted: string;
  public totalPrice: number;
  constructor() {}

  ngOnInit(): void {
    this.planDiscounted === 'Yes'
      ? (this.totalPrice = this.getDiscountedPrice(
          this.planPrice,
          this.planDiscountedPrice
        ))
      : (this.totalPrice = +this.planPrice);
  }

  public getDiscountedPrice = (
    planPrice: string,
    planDiscountedPrice?: string
  ) => {
    return +planPrice - +planDiscountedPrice;
  }
}
