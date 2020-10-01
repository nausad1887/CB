import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostJdModalComponent } from './edit-post-jd-modal.component';

describe('EditPostJdModalComponent', () => {
  let component: EditPostJdModalComponent;
  let fixture: ComponentFixture<EditPostJdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostJdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostJdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
