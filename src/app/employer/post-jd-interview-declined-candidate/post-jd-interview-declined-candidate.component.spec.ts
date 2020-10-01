import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdInterviewDeclinedCandidateComponent } from './post-jd-interview-declined-candidate.component';

describe('PostJdInterviewDeclinedCandidateComponent', () => {
  let component: PostJdInterviewDeclinedCandidateComponent;
  let fixture: ComponentFixture<PostJdInterviewDeclinedCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdInterviewDeclinedCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdInterviewDeclinedCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
