import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn } from '../subscrptions-skeleton/animation';

@Component({
  selector: 'app-interviews-skeleton',
  templateUrl: './interviews-skeleton.component.html',
  styleUrls: ['./interviews-skeleton.component.css'],
  animations: [trigger('fadeIn', fadeIn())],
})
export class InterviewsSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
