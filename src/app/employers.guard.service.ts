import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class EmployersGuardService {
  constructor(private router: Router, public homeService: HomeService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentEmployer = this.homeService.getCurrentEmployerFromLocalStorage()
      ? this.homeService.getCurrentEmployerFromLocalStorage()
      : this.homeService.getCurrentEmployerFromSessionStorage();
    if (!this.isEmpty(currentEmployer) || !this.isBlank(currentEmployer)) {
      return true;
    } else {
      // not logged in so redirect to login page
      this.homeService.isEmployerTrue(false);
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
