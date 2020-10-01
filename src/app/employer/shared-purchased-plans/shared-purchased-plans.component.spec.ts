import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPurchasedPlansComponent } from './shared-purchased-plans.component';

describe('SharedPurchasedPlansComponent', () => {
  let component: SharedPurchasedPlansComponent;
  let fixture: ComponentFixture<SharedPurchasedPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPurchasedPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPurchasedPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
