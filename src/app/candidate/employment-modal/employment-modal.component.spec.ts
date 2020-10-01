import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentModalComponent } from './employment-modal.component';

describe('EmploymentModalComponent', () => {
  let component: EmploymentModalComponent;
  let fixture: ComponentFixture<EmploymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
