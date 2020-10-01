import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdInterviewedComponent } from './post-jd-interviewed.component';

describe('PostJdInterviewedComponent', () => {
  let component: PostJdInterviewedComponent;
  let fixture: ComponentFixture<PostJdInterviewedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdInterviewedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdInterviewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
