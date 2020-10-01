import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedScheduledComponent } from './shared-scheduled.component';

describe('SharedScheduledComponent', () => {
  let component: SharedScheduledComponent;
  let fixture: ComponentFixture<SharedScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
