import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-count-interviews',
  templateUrl: './shared-count-interviews.component.html',
  styleUrls: ['./shared-count-interviews.component.css'],
})
export class SharedCountInterviewsComponent implements OnInit {
  public loadingSelected = true;
  public loadingRejected = true;
  public loadingDeclined = true;
  public loadingTotal = true;
  @Input() selected: string;
  @Input() rejected: string;
  @Input() total: string;
  @Input() declined: string;
  constructor() {}

  ngOnInit(): void {}
}
