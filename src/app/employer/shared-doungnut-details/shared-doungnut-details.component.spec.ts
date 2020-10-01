import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDoungnutDetailsComponent } from './shared-doungnut-details.component';

describe('SharedDoungnutDetailsComponent', () => {
  let component: SharedDoungnutDetailsComponent;
  let fixture: ComponentFixture<SharedDoungnutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedDoungnutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDoungnutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
