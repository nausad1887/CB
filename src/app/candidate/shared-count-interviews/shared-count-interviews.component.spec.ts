import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCountInterviewsComponent } from './shared-count-interviews.component';

describe('SharedCountInterviewsComponent', () => {
  let component: SharedCountInterviewsComponent;
  let fixture: ComponentFixture<SharedCountInterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCountInterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCountInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
