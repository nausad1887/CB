import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import {map,debounceTime,distinctUntilChanged,mergeMap,delay} from 'rxjs/operators';

@Component({
  selector: 'app-shared-inprocess-search',
  templateUrl: './shared-inprocess-search.component.html',
  styleUrls: ['./shared-inprocess-search.component.css'],
})
export class SharedInprocessSearchComponent implements OnInit {
  @Output() searchinprocess: EventEmitter<string> = new EventEmitter();
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
        this.searchinprocess.emit(input);
      });
  }

  ngOnInit(): void {
    // Date
    ($('#example1') as any).calendar({
      type: 'date',
    });
  }
}
