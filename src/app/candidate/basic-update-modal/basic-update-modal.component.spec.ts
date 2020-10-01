import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicUpdateModalComponent } from './basic-update-modal.component';

describe('BasicUpdateModalComponent', () => {
  let component: BasicUpdateModalComponent;
  let fixture: ComponentFixture<BasicUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
