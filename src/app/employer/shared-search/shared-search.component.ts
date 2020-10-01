import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription, of } from 'rxjs';
import {map,debounceTime,distinctUntilChanged,mergeMap,delay} from 'rxjs/operators';

@Component({
  selector: 'app-shared-search',
  templateUrl: './shared-search.component.html',
  styleUrls: ['./shared-search.component.css'],
})
export class SharedSearchComponent implements OnInit {
  @Output() searchText: EventEmitter<string> = new EventEmitter();
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
        this.searchText.emit(input);
      });
  }

  ngOnInit(): void {
    // Date
    ($('#example1') as any).calendar({
      type: 'date',
    });
  }
}
