import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSearchJobRoleComponent } from './quick-search-job-role.component';

describe('QuickSearchJobRoleComponent', () => {
  let component: QuickSearchJobRoleComponent;
  let fixture: ComponentFixture<QuickSearchJobRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickSearchJobRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSearchJobRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
