import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Skill } from './candidateInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shareReplay, retry, catchError} from 'rxjs/operators';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { HomeService } from './home.service';
const CACHE_SIZE = 1;
const skillsListUrl = '/skill/get-skill-list';
@Injectable({
  providedIn: 'root',
})
export class ResolverService implements Resolve<Skill> {
  private skillsList$: Observable<Array<Skill>>;
  constructor(public http: HttpClient, public homeService: HomeService) {}
  httpOptions = {headers: new HttpHeaders({})};

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Observable<never> {
    if (!this.skillsList$) {
      const data = {searchWord: ''};
      this.skillsList$ = this.getSkillsLists(data).pipe(shareReplay(CACHE_SIZE));
    }
    return this.skillsList$;
  }

  public getSkillsLists(data: any): Observable<any> {
    const form = new FormData();
    const fData = `[{
        "loginuserID": "0",
        "searchWord":"${data.searchWord}",
        "apiType": "Android",
        "apiVersion": "1.0"
      }]`;
    form.append('json', fData);
    return this.http
      .post<any>(skillsListUrl, form, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ErrorHandling
  public handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get Client Side Error
      errorMessage = error.error.messages;
    } else {
      // Get Server-Side Error
      errorMessage = `Error Code : ${error.status}\nMessage : ${error.messsage}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
