import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReScheduledComponent } from './re-scheduled.component';

describe('ReScheduledComponent', () => {
  let component: ReScheduledComponent;
  let fixture: ComponentFixture<ReScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
