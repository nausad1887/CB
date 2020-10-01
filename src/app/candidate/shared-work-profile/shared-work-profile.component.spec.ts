import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWorkProfileComponent } from './shared-work-profile.component';

describe('SharedWorkProfileComponent', () => {
  let component: SharedWorkProfileComponent;
  let fixture: ComponentFixture<SharedWorkProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedWorkProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWorkProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
