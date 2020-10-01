import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobjdDetailsSkeletonComponent } from './jobjd-details-skeleton.component';

describe('JobjdDetailsSkeletonComponent', () => {
  let component: JobjdDetailsSkeletonComponent;
  let fixture: ComponentFixture<JobjdDetailsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobjdDetailsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobjdDetailsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
