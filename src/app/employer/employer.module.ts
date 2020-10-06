import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { RouterModule } from '@angular/router';
import { EmployersGuardService } from '../employers.guard.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InterviewsComponent } from './interviews/interviews.component';
import { PostJdComponent } from './post-jd/post-jd.component';
import { SearchComponent } from './search/search.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { SettingComponent } from './setting/setting.component';
import { SupportComponent } from './support/support.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { PostJdModalComponent } from './post-jd-modal/post-jd-modal.component';
import { EditPostJdModalComponent } from './edit-post-jd-modal/edit-post-jd-modal.component';
import { PostJdDetailsComponent } from './post-jd-details/post-jd-details.component';
import { PostJdHiredComponent } from './post-jd-hired/post-jd-hired.component';
import { PostJdInterviewDeclinedCandidateComponent } from './post-jd-interview-declined-candidate/post-jd-interview-declined-candidate.component';
import { PostJdInterviewedComponent } from './post-jd-interviewed/post-jd-interviewed.component';
import { PostJdJobDeclinedCandidateComponent } from './post-jd-job-declined-candidate/post-jd-job-declined-candidate.component';
import { PostJdRejectedCandidatesComponent } from './post-jd-rejected-candidates/post-jd-rejected-candidates.component';
import { PostJdSelectedOnboardingComponent } from './post-jd-selected-onboarding/post-jd-selected-onboarding.component';
import { SaveFolderModalComponent } from './save-folder-modal/save-folder-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployerService } from './employer.service';
import { SearchPipe } from './search/custom-search.pipe';
import { SearchByJdComponent } from './search-by-jd/search-by-jd.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedFilterComponent } from './shared-filter/shared-filter.component';
import { SharedGlobalSearchComponent } from './shared-global-search/shared-global-search.component';
import { QuickSearchJobRoleComponent } from './quick-search-job-role/quick-search-job-role.component';
import { SharedScheduledComponent } from './shared-scheduled/shared-scheduled.component';
import { SharedInProcessComponent } from './shared-in-process/shared-in-process.component';
import { SharedReScheduledComponent } from './shared-re-scheduled/shared-re-scheduled.component';
import { SharedUnavailableComponent } from './shared-unavailable/shared-unavailable.component';
import { SharedSearchComponent } from './shared-search/shared-search.component';
import { SharedInprocessSearchComponent } from './shared-inprocess-search/shared-inprocess-search.component';
import { SharedRescheduledSearchComponent } from './shared-rescheduled-search/shared-rescheduled-search.component';
import { SharedUnavailableSearchComponent } from './shared-unavailable-search/shared-unavailable-search.component';
import { SharedPostJdDetailsSearchComponent } from './shared-post-jd-details-search/shared-post-jd-details-search.component';
import { PostJdAllComponent } from './post-jd-all/post-jd-all.component';
import { SharedScheduledStatusComponent } from './shared-scheduled-status/shared-scheduled-status.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { AddFolderModalComponent } from './add-folder-modal/add-folder-modal.component';
import { AddDownloadFolderComponent } from './add-download-folder/add-download-folder.component';
import { SharedPlansComponent } from './shared-plans/shared-plans.component';
import { SharedPurchasedPlansComponent } from './shared-purchased-plans/shared-purchased-plans.component';
import { SubscrptionsSkeletonComponent } from './subscrptions-skeleton/subscrptions-skeleton.component';
import { SubscriptionSkeleton2Component } from './subscription-skeleton2/subscription-skeleton2.component';
import { SharedSkillsComponent } from './shared-skills/shared-skills.component';
import { SharedTodayScheduledComponent } from './shared-today-scheduled/shared-today-scheduled.component';
import { SharedDoungnutDetailsComponent } from './shared-doungnut-details/shared-doungnut-details.component';
import { ResolverService } from '../resolver.service';
import { SharedTodaysSkeletonComponent } from './shared-todays-skeleton/shared-todays-skeleton.component';
import { DownloadComponent } from './download/download.component';
import { CandidateProfileViewComponent } from './candidate-profile-view/candidate-profile-view.component';
import { ScheduleInterviewModalComponent } from './schedule-interview-modal/schedule-interview-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReScheduleModalComponent } from './re-schedule-modal/re-schedule-modal.component';
import { JobjdDetailsSkeletonComponent } from './jobjd-details-skeleton/jobjd-details-skeleton.component';
import { InterviewsSkeletonComponent } from './interviews-skeleton/interviews-skeleton.component';
import { SkillpipePipe } from './shared-filter/skillpipe.pipe';
import { CitypipePipe } from './shared-filter/citypipe.pipe';
import { IndustrypipePipe } from './shared-filter/industrypipe.pipe';
import { DegreepipePipe } from './shared-filter/degreepipe.pipe';
import { NoticePipe } from './shared-filter/notice.pipe';
import { LanguagePipe } from './shared-filter/language.pipe';
import { EmperiancePipe } from './shared-filter/emperiance.pipe';
import { CountryPipe } from './shared-filter/country.pipe';
import { AvailableListsPipe } from './shared-filter/available-lists.pipe';
import { ViewJdComponent } from './view-jd/view-jd.component';
import { CandidatePipe } from './post-jd-details/candidate.pipe';
import { NamePipe } from './interviews/name.pipe';
@NgModule({
  declarations: [
    EmployerDashboardComponent,
    InterviewsComponent,
    PostJdComponent,
    SearchComponent,
    SubscriptionComponent,
    FavouriteComponent,
    DownloadsComponent,
    SettingComponent,
    SupportComponent,
    FooterComponent,
    ScrollToTopComponent,
    PostJdModalComponent,
    EditPostJdModalComponent,
    PostJdDetailsComponent,
    PostJdHiredComponent,
    PostJdInterviewDeclinedCandidateComponent,
    PostJdInterviewedComponent,
    PostJdJobDeclinedCandidateComponent,
    PostJdRejectedCandidatesComponent,
    PostJdSelectedOnboardingComponent,
    SaveFolderModalComponent,
    SearchPipe,
    SearchByJdComponent,
    GlobalSearchComponent,
    SharedFilterComponent,
    SharedGlobalSearchComponent,
    QuickSearchJobRoleComponent,
    SharedScheduledComponent,
    SharedInProcessComponent,
    SharedReScheduledComponent,
    SharedUnavailableComponent,
    SharedSearchComponent,
    SharedInprocessSearchComponent,
    SharedRescheduledSearchComponent,
    SharedUnavailableSearchComponent,
    SharedPostJdDetailsSearchComponent,
    PostJdAllComponent,
    SharedScheduledStatusComponent,
    ProfileComponent,
    EditProfileModalComponent,
    AddFolderModalComponent,
    AddDownloadFolderComponent,
    SharedPlansComponent,
    SharedPurchasedPlansComponent,
    SubscrptionsSkeletonComponent,
    SubscriptionSkeleton2Component,
    SharedSkillsComponent,
    SharedTodayScheduledComponent,
    SharedDoungnutDetailsComponent,
    SharedTodaysSkeletonComponent,
    DownloadComponent,
    CandidateProfileViewComponent,
    ScheduleInterviewModalComponent,
    ReScheduleModalComponent,
    JobjdDetailsSkeletonComponent,
    InterviewsSkeletonComponent,
    SkillpipePipe,
    CitypipePipe,
    IndustrypipePipe,
    DegreepipePipe,
    NoticePipe,
    LanguagePipe,
    EmperiancePipe,
    CountryPipe,
    AvailableListsPipe,
    ViewJdComponent,
    CandidatePipe,
    NamePipe,
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: 'employer-dashboard',
        resolve: { skills: ResolverService },
        component: EmployerDashboardComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'search',
        component: SearchComponent,
        children: [
          { path: '', redirectTo: 'search-by-jd', pathMatch: 'full' },
          {
            path: 'search-by-jd',
            component: SearchByJdComponent,
          },
          {
            path: 'global',
            component: GlobalSearchComponent,
          },
        ],
        canActivate: [EmployersGuardService],
      },
      {
        path: 'candidate-profile-view',
        component: CandidateProfileViewComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'employer-settings',
        component: SettingComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'post-jd',
        children: [
          { path: '', component: PostJdComponent },
          {
            path: 'post-jd-details',
            component: PostJdDetailsComponent,
            canActivate: [EmployersGuardService],
          },
        ],
        canActivate: [EmployersGuardService],
      },
      {
        path: 'employer-subscription',
        component: SubscriptionComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'interviews',
        component: InterviewsComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'employer-profile',
        component: ProfileComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'employer-downloads',
        component: DownloadsComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'employer-favourites',
        component: FavouriteComponent,
        canActivate: [EmployersGuardService],
      },
      {
        path: 'support',
        component: SupportComponent,
        canActivate: [EmployersGuardService],
      },
    ]),
  ],
  entryComponents: [
    PostJdModalComponent,
    EditPostJdModalComponent,
    SaveFolderModalComponent,
  ],
  exports: [],
  providers: [EmployerService],
})
export class EmployerModule {}
