import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdSelectedOnboardingComponent } from './post-jd-selected-onboarding.component';

describe('PostJdSelectedOnboardingComponent', () => {
  let component: PostJdSelectedOnboardingComponent;
  let fixture: ComponentFixture<PostJdSelectedOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdSelectedOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdSelectedOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
