import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewRequestsComponent } from './interview-requests.component';

describe('InterviewRequestsComponent', () => {
  let component: InterviewRequestsComponent;
  let fixture: ComponentFixture<InterviewRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
