import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDownloadFolderComponent } from './add-download-folder.component';

describe('AddDownloadFolderComponent', () => {
  let component: AddDownloadFolderComponent;
  let fixture: ComponentFixture<AddDownloadFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDownloadFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDownloadFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
