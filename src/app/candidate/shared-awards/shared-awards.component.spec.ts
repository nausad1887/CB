import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAwardsComponent } from './shared-awards.component';

describe('SharedAwardsComponent', () => {
  let component: SharedAwardsComponent;
  let fixture: ComponentFixture<SharedAwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedAwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
