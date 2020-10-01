import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, mergeMap, delay} from 'rxjs/operators';

@Component({
  selector: 'app-shared-post-jd-details-search',
  templateUrl: './shared-post-jd-details-search.component.html',
  styleUrls: ['./shared-post-jd-details-search.component.css'],
})
export class SharedPostJdDetailsSearchComponent implements OnInit {
  @Output() filterCandidate: EventEmitter<string> = new EventEmitter();
  public search = new Subject<KeyboardEvent>();
  public subscription: Subscription;
  constructor() {
    this.subscription = this.search
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(0),
        distinctUntilChanged(),
        mergeMap((search) => of(search).pipe(delay(1)))
      )
      .subscribe((input) => {
        this.filterCandidate.emit(input);
      });
  }

  ngOnInit(): void {
    // Date
    ($('#example1') as any).calendar({
      type: 'date',
    });
  }
}
