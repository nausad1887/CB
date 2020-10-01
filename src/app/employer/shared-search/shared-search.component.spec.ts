import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSearchComponent } from './shared-search.component';

describe('SharedSearchComponent', () => {
  let component: SharedSearchComponent;
  let fixture: ComponentFixture<SharedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
