import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCertificationComponent } from './shared-certification.component';

describe('SharedCertificationComponent', () => {
  let component: SharedCertificationComponent;
  let fixture: ComponentFixture<SharedCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
