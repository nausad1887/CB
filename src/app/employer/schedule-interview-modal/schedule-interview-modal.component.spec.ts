import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInterviewModalComponent } from './schedule-interview-modal.component';

describe('ScheduleInterviewModalComponent', () => {
  let component: ScheduleInterviewModalComponent;
  let fixture: ComponentFixture<ScheduleInterviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleInterviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleInterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
