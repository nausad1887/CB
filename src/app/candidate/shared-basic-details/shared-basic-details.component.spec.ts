import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBasicDetailsComponent } from './shared-basic-details.component';

describe('SharedBasicDetailsComponent', () => {
  let component: SharedBasicDetailsComponent;
  let fixture: ComponentFixture<SharedBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
