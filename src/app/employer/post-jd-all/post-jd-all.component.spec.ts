import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdAllComponent } from './post-jd-all.component';

describe('PostJdAllComponent', () => {
  let component: PostJdAllComponent;
  let fixture: ComponentFixture<PostJdAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
