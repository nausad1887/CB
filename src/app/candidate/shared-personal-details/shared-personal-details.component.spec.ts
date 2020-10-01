import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPersonalDetailsComponent } from './shared-personal-details.component';

describe('SharedPersonalDetailsComponent', () => {
  let component: SharedPersonalDetailsComponent;
  let fixture: ComponentFixture<SharedPersonalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPersonalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
