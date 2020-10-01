import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscrptionsSkeletonComponent } from './subscrptions-skeleton.component';

describe('SubscrptionsSkeletonComponent', () => {
  let component: SubscrptionsSkeletonComponent;
  let fixture: ComponentFixture<SubscrptionsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscrptionsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscrptionsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
