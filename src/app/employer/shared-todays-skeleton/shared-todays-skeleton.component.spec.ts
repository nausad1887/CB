import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTodaysSkeletonComponent } from './shared-todays-skeleton.component';

describe('SharedTodaysSkeletonComponent', () => {
  let component: SharedTodaysSkeletonComponent;
  let fixture: ComponentFixture<SharedTodaysSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTodaysSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTodaysSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
