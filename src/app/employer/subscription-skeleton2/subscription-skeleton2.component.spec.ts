import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionSkeleton2Component } from './subscription-skeleton2.component';

describe('SubscriptionSkeleton2Component', () => {
  let component: SubscriptionSkeleton2Component;
  let fixture: ComponentFixture<SubscriptionSkeleton2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionSkeleton2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionSkeleton2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
