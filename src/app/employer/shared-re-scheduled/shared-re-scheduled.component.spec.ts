import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReScheduledComponent } from './shared-re-scheduled.component';

describe('SharedReScheduledComponent', () => {
  let component: SharedReScheduledComponent;
  let fixture: ComponentFixture<SharedReScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedReScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedReScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
