import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFolderModalComponent } from './save-folder-modal.component';

describe('SaveFolderModalComponent', () => {
  let component: SaveFolderModalComponent;
  let fixture: ComponentFixture<SaveFolderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveFolderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
