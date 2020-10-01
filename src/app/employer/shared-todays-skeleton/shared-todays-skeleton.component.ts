import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../subscrptions-skeleton/animation';

@Component({
  selector: 'app-shared-todays-skeleton',
  templateUrl: './shared-todays-skeleton.component.html',
  styleUrls: ['./shared-todays-skeleton.component.css'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class SharedTodaysSkeletonComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
