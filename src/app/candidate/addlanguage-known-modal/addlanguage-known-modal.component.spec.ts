import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlanguageKnownModalComponent } from './addlanguage-known-modal.component';

describe('AddlanguageKnownModalComponent', () => {
  let component: AddlanguageKnownModalComponent;
  let fixture: ComponentFixture<AddlanguageKnownModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlanguageKnownModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlanguageKnownModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
