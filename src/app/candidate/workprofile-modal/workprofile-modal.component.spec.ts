import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkprofileModalComponent } from './workprofile-modal.component';

describe('WorkprofileModalComponent', () => {
  let component: WorkprofileModalComponent;
  let fixture: ComponentFixture<WorkprofileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkprofileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkprofileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
