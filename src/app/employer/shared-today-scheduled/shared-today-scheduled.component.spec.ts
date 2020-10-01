import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTodayScheduledComponent } from './shared-today-scheduled.component';

describe('SharedTodayScheduledComponent', () => {
  let component: SharedTodayScheduledComponent;
  let fixture: ComponentFixture<SharedTodayScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTodayScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTodayScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
