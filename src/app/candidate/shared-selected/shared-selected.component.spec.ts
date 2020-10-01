import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSelectedComponent } from './shared-selected.component';

describe('SharedSelectedComponent', () => {
  let component: SharedSelectedComponent;
  let fixture: ComponentFixture<SharedSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
