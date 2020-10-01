import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedScheduledStatusComponent } from './shared-scheduled-status.component';

describe('SharedScheduledStatusComponent', () => {
  let component: SharedScheduledStatusComponent;
  let fixture: ComponentFixture<SharedScheduledStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedScheduledStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedScheduledStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
