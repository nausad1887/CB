import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedEmploymentComponent } from './shared-employment.component';

describe('SharedEmploymentComponent', () => {
  let component: SharedEmploymentComponent;
  let fixture: ComponentFixture<SharedEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
