import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInterviewedComponent } from './shared-interviewed.component';

describe('SharedInterviewedComponent', () => {
  let component: SharedInterviewedComponent;
  let fixture: ComponentFixture<SharedInterviewedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInterviewedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInterviewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
