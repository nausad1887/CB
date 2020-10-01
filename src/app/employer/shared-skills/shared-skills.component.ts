import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-skills',
  templateUrl: './shared-skills.component.html',
  styleUrls: ['./shared-skills.component.css'],
})
export class SharedSkillsComponent implements OnInit {
  @Input() skillName: string;
  constructor() {}

  ngOnInit(): void {}
}
