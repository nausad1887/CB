import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReScheduleModalComponent } from './re-schedule-modal.component';

describe('ReScheduleModalComponent', () => {
  let component: ReScheduleModalComponent;
  let fixture: ComponentFixture<ReScheduleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReScheduleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
