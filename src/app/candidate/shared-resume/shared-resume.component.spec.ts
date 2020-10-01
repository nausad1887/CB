import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedResumeComponent } from './shared-resume.component';

describe('SharedResumeComponent', () => {
  let component: SharedResumeComponent;
  let fixture: ComponentFixture<SharedResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
