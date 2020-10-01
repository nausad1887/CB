import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirtificateModalComponent } from './cirtificate-modal.component';

describe('CirtificateModalComponent', () => {
  let component: CirtificateModalComponent;
  let fixture: ComponentFixture<CirtificateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirtificateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirtificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
