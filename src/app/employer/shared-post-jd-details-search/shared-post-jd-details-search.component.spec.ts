import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPostJdDetailsSearchComponent } from './shared-post-jd-details-search.component';

describe('SharedPostJdDetailsSearchComponent', () => {
  let component: SharedPostJdDetailsSearchComponent;
  let fixture: ComponentFixture<SharedPostJdDetailsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPostJdDetailsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPostJdDetailsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
