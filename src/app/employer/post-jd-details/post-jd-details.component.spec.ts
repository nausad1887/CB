import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdDetailsComponent } from './post-jd-details.component';

describe('PostJdDetailsComponent', () => {
  let component: PostJdDetailsComponent;
  let fixture: ComponentFixture<PostJdDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
