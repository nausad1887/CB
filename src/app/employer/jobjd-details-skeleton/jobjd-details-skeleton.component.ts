import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeIn } from '../subscrptions-skeleton/animation';

@Component({
  selector: 'app-jobjd-details-skeleton',
  templateUrl: './jobjd-details-skeleton.component.html',
  styleUrls: ['./jobjd-details-skeleton.component.css'],
  animations: [trigger('fadeIn', fadeIn())]
})
export class JobjdDetailsSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
