import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class CandidateGuardService {
  constructor(private router: Router, public homeService: HomeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.homeService.getCurrentUserFromLocalStorage()
      ? this.homeService.getCurrentUserFromLocalStorage()
      : this.homeService.getCurrentUserFromSessionStorage();
    if (!this.isEmpty(currentUser || !this.isBlank(currentUser))) {
      return true;
    } else {
      // not logged in so redirect to login page
      this.homeService.isCandidateTrue(false);
      this.router.navigate(['/home']);
    }
  }

isEmpty(str: string | any[]) {
    return (!str || 0 === str.length);
}
isBlank(str: string | any) {
  return (!str || /^\s*$/.test(str));
}
}
