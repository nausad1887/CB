import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdJobDeclinedCandidateComponent } from './post-jd-job-declined-candidate.component';

describe('PostJdJobDeclinedCandidateComponent', () => {
  let component: PostJdJobDeclinedCandidateComponent;
  let fixture: ComponentFixture<PostJdJobDeclinedCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdJobDeclinedCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdJobDeclinedCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
