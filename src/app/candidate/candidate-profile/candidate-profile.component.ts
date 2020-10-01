import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
})
export class CandidateProfileComponent implements OnInit {
  // @ViewChild('award') public award: ElementRef;
  @ViewChild('AttachResume') public AttachResume: ElementRef;
  @ViewChild('summary') public summary: ElementRef;
  @ViewChild('skills') public skills: ElementRef;
  @ViewChild('education') public education: ElementRef;
  @ViewChild('employment') public employment: ElementRef;
  @ViewChild('certificate') public certificate: ElementRef;
  @ViewChild('profile') public profile: ElementRef;
  @ViewChild('pdetails') public pdetails: ElementRef;
  constructor() {}
  ngOnInit(): void {}

  // public moveToAward(): void {
  //   this.award.nativeElement.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center',
  //   });
  // }
  public moveToResume(): void {
    this.AttachResume.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToResumeSummary(): void {
    this.summary.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToSkills(): void {
    this.skills.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToEducation(): void {
    this.education.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToEmployment(): void {
    this.employment.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToCertificate(): void {
    this.certificate.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToProfile(): void {
    this.profile.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
  public moveToPersonalDetails(): void {
    this.pdetails.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}
