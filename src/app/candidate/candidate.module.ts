import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewComponent } from './interview/interview.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { ReferalComponent } from './referal/referal.component';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CandidateService } from './candidate.service';
import { SettingComponent } from './setting/setting.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { CandidateFooterComponent } from './candidate-footer/candidate-footer.component';
import { SharedProfileComponent } from './shared-profile/shared-profile.component';
import { BasicUpdateModalComponent } from './basic-update-modal/basic-update-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkillModalComponent } from './skill-modal/skill-modal.component';
import { EducationModalComponent } from './education-modal/education-modal.component';
import { EmploymentModalComponent } from './employment-modal/employment-modal.component';
import { AwardModalComponent } from './award-modal/award-modal.component';
import { CirtificateModalComponent } from './cirtificate-modal/cirtificate-modal.component';
import { CandidateGuardService } from '../candidate-guard.service';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { WorkprofileModalComponent } from './workprofile-modal/workprofile-modal.component';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { AddlanguageKnownModalComponent } from './addlanguage-known-modal/addlanguage-known-modal.component';
import { InterviewRequestsComponent } from './interview-requests/interview-requests.component';
import { ScheduledInterviewsComponent } from './scheduled-interviews/scheduled-interviews.component';
import { ReScheduledComponent } from './re-scheduled/re-scheduled.component';
import { DeclinedComponent } from './declined/declined.component';
import { DeclineModalComponent } from './decline-modal/decline-modal.component';
import { SharedCountInterviewsComponent } from './shared-count-interviews/shared-count-interviews.component';
import { SharedInterviewedComponent } from './shared-interviewed/shared-interviewed.component';
import { SharedSelectedComponent } from './shared-selected/shared-selected.component';
import { SharedBasicDetailsComponent } from './shared-basic-details/shared-basic-details.component';
import { SharedSkillsComponent } from './shared-skills/shared-skills.component';
import { SharedEducationComponent } from './shared-education/shared-education.component';
import { SharedEmploymentComponent } from './shared-employment/shared-employment.component';
import { SharedCertificationComponent } from './shared-certification/shared-certification.component';
import { SharedAwardsComponent } from './shared-awards/shared-awards.component';
import { SharedWorkProfileComponent } from './shared-work-profile/shared-work-profile.component';
import { SharedPersonalDetailsComponent } from './shared-personal-details/shared-personal-details.component';
import { SharedResumeComponent } from './shared-resume/shared-resume.component';
import { ReScheduleModalComponent } from './re-schedule-modal/re-schedule-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SortByIdPipe } from './interview/sort-by-id.pipe';
import { SortByDateTimePipe } from './interview/sort-by-date-time.pipe';

@NgModule({
  declarations: [
    InterviewComponent,
    JobStatusComponent,
    ReferalComponent,
    CandidateFooterComponent,
    CandidateProfileComponent,
    JobDetailsComponent,
    SettingComponent,
    SharedProfileComponent,
    BasicUpdateModalComponent,
    SkillModalComponent,
    EducationModalComponent,
    EmploymentModalComponent,
    AwardModalComponent,
    CirtificateModalComponent,
    ScrollToTopComponent,
    WorkprofileModalComponent,
    UpdateProfileModalComponent,
    AddlanguageKnownModalComponent,
    InterviewRequestsComponent,
    ScheduledInterviewsComponent,
    ReScheduledComponent,
    DeclinedComponent,
    DeclineModalComponent,
    SharedCountInterviewsComponent,
    SharedInterviewedComponent,
    SharedSelectedComponent,
    SharedBasicDetailsComponent,
    SharedSkillsComponent,
    SharedEducationComponent,
    SharedEmploymentComponent,
    SharedCertificationComponent,
    SharedAwardsComponent,
    SharedWorkProfileComponent,
    SharedPersonalDetailsComponent,
    SharedResumeComponent,
    ReScheduleModalComponent,
    SortByIdPipe,
    SortByDateTimePipe,
  ],
  exports: [
    CandidateFooterComponent,
    SharedProfileComponent,
    InterviewComponent,
    ScrollToTopComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    MatSnackBarModule,
    FormsModule,
    OwlDateTimeModule,
    ReactiveFormsModule,
    OwlNativeDateTimeModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    MatProgressBarModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: 'dashboard',
        children: [
          { path: '', component: InterviewComponent },
          {
            path: 'candidate-profile',
            component: CandidateProfileComponent,
            canActivate: [CandidateGuardService],
          },
          {
            path: 'job-details',
            component: JobDetailsComponent,
            canActivate: [CandidateGuardService],
          },
        ],
        canActivate: [CandidateGuardService],
      },
      {
        path: 'job-status',
        children: [
          { path: '', component: JobStatusComponent },
          {
            path: 'job-details',
            component: JobDetailsComponent,
            canActivate: [CandidateGuardService],
          },
        ],
        canActivate: [CandidateGuardService],
      },
      {
        path: 'referal',
        component: ReferalComponent,
        canActivate: [CandidateGuardService],
      },
      {
        path: 'setting',
        component: SettingComponent,
        canActivate: [CandidateGuardService],
      },
    ]),
  ],
  entryComponents: [
    BasicUpdateModalComponent,
    SkillModalComponent,
    EducationModalComponent,
    EmploymentModalComponent,
    AwardModalComponent,
    CirtificateModalComponent,
    WorkprofileModalComponent,
    UpdateProfileModalComponent,
    AddlanguageKnownModalComponent,
  ],
  providers: [
    CandidateService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    // },
  ],
})
export class CandidateModule {}
