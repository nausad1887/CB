import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdHiredComponent } from './post-jd-hired.component';

describe('PostJdHiredComponent', () => {
  let component: PostJdHiredComponent;
  let fixture: ComponentFixture<PostJdHiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdHiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdHiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
