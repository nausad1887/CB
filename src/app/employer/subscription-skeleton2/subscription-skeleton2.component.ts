import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../subscrptions-skeleton/animation';

@Component({
  selector: 'app-subscription-skeleton2',
  templateUrl: './subscription-skeleton2.component.html',
  styleUrls: ['./subscription-skeleton2.component.css'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SubscriptionSkeleton2Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
