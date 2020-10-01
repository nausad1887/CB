import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInprocessSearchComponent } from './shared-inprocess-search.component';

describe('SharedInprocessSearchComponent', () => {
  let component: SharedInprocessSearchComponent;
  let fixture: ComponentFixture<SharedInprocessSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInprocessSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInprocessSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
