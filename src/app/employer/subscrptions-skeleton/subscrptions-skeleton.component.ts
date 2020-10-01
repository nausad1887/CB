import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from './animation';

@Component({
  selector: 'app-subscrptions-skeleton',
  templateUrl: './subscrptions-skeleton.component.html',
  styleUrls: ['./subscrptions-skeleton.component.css'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SubscrptionsSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
