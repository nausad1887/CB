import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'terms-and-conditions', component: TermsAndConditionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
