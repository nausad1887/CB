import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJdModalComponent } from './post-jd-modal.component';

describe('PostJdModalComponent', () => {
  let component: PostJdModalComponent;
  let fixture: ComponentFixture<PostJdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
