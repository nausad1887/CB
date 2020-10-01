import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRescheduledSearchComponent } from './shared-rescheduled-search.component';

describe('SharedRescheduledSearchComponent', () => {
  let component: SharedRescheduledSearchComponent;
  let fixture: ComponentFixture<SharedRescheduledSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedRescheduledSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRescheduledSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
