import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUnavailableComponent } from './shared-unavailable.component';

describe('SharedUnavailableComponent', () => {
  let component: SharedUnavailableComponent;
  let fixture: ComponentFixture<SharedUnavailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUnavailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
