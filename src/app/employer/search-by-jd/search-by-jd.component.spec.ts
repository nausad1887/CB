import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByJdComponent } from './search-by-jd.component';

describe('SearchByJdComponent', () => {
  let component: SearchByJdComponent;
  let fixture: ComponentFixture<SearchByJdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByJdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByJdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
