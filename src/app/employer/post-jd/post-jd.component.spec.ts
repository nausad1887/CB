import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdComponent } from './post-jd.component';

describe('PostJdComponent', () => {
  let component: PostJdComponent;
  let fixture: ComponentFixture<PostJdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
