import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSkillsComponent } from './shared-skills.component';

describe('SharedSkillsComponent', () => {
  let component: SharedSkillsComponent;
  let fixture: ComponentFixture<SharedSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
