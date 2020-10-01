import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewsSkeletonComponent } from './interviews-skeleton.component';

describe('InterviewsSkeletonComponent', () => {
  let component: InterviewsSkeletonComponent;
  let fixture: ComponentFixture<InterviewsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
