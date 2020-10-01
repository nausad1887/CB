import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileViewComponent } from './candidate-profile-view.component';

describe('CandidateProfileViewComponent', () => {
  let component: CandidateProfileViewComponent;
  let fixture: ComponentFixture<CandidateProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
