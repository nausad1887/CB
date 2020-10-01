import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedGlobalSearchComponent } from './shared-global-search.component';

describe('SharedGlobalSearchComponent', () => {
  let component: SharedGlobalSearchComponent;
  let fixture: ComponentFixture<SharedGlobalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedGlobalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
