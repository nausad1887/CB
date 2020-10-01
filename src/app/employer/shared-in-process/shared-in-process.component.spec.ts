import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInProcessComponent } from './shared-in-process.component';

describe('SharedInProcessComponent', () => {
  let component: SharedInProcessComponent;
  let fixture: ComponentFixture<SharedInProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
