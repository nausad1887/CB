import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedEducationComponent } from './shared-education.component';

describe('SharedEducationComponent', () => {
  let component: SharedEducationComponent;
  let fixture: ComponentFixture<SharedEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
