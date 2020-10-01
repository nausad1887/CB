import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUnavailableSearchComponent } from './shared-unavailable-search.component';

describe('SharedUnavailableSearchComponent', () => {
  let component: SharedUnavailableSearchComponent;
  let fixture: ComponentFixture<SharedUnavailableSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUnavailableSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUnavailableSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
