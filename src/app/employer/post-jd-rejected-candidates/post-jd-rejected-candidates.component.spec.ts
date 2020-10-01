import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdRejectedCandidatesComponent } from './post-jd-rejected-candidates.component';

describe('PostJdRejectedCandidatesComponent', () => {
  let component: PostJdRejectedCandidatesComponent;
  let fixture: ComponentFixture<PostJdRejectedCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdRejectedCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdRejectedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
