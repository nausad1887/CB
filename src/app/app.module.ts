import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { CandidateNavbarComponent } from './candidate-navbar/candidate-navbar.component';
import { EmployeeNavbarComponent } from './employee-navbar/employee-navbar.component';
import { HomeComponent } from './home/home.component';
import { HomeFooterComponent } from './home-footer/home-footer.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HomeService } from './home.service';
import { CandidateGuardService } from './candidate-guard.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CandidateModule } from './candidate/candidate.module';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptors/HttpErrorInterceptor';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VerificationModalComponent } from './verification-modal/verification-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignUpModalComponent } from './sign-up-modal/sign-up-modal.component';
import { ForgetPasswordModalComponent } from './forget-password-modal/forget-password-modal.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { DisableControlDirective } from './login-modal/disable-control.directive';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EmployerModule } from './employer/employer.module';
import * as $ from 'jquery';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CandidateNavbarComponent,
    EmployeeNavbarComponent,
    HomeComponent,
    HomeFooterComponent,
    AboutUsComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    VerificationModalComponent,
    LoginModalComponent,
    SignUpModalComponent,
    ForgetPasswordModalComponent,
    ResetPasswordModalComponent,
    DisableControlDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgxSpinnerModule,
    CarouselModule,
    CandidateModule,
    EmployerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbModule,
  ],
  providers: [
    HomeService,
    NgbActiveModal,
    CandidateGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    VerificationModalComponent,
    ForgetPasswordModalComponent,
    ResetPasswordModalComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
