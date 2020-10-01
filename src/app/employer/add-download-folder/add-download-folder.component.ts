import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmployerService } from '../employer.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-download-folder',
  templateUrl: './add-download-folder.component.html',
  styleUrls: ['./add-download-folder.component.css'],
})
export class AddDownloadFolderComponent implements OnInit {
  @Input() post: any;
  @Input() addFolder: boolean;
  @Input() editFolder: boolean;
  addFolderForm: FormGroup;
  editFolderForm: FormGroup;
  constructor(
    public employerService: EmployerService,
    public fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) {
    this.addFolderForm = fb.group({
      employerdownloadName: ['', Validators.compose([Validators.required])],
    });
  }
  ngOnInit(): void {
    this.editFolderForm = this.fb.group({
      employerdownloadName: [
        this.post.employerdownloadName ? this.post.employerdownloadName : '',
        Validators.compose([Validators.required]),
      ],
    });
  }
  onClose() {
    this.activeModal.close();
  }

  public onAddFolder = (post: any) => {
    this.markFormTouched(this.addFolderForm);
    if (this.addFolderForm.valid) {
      this.spinner.show();
      post.loginemployerID = this.post.loginemployerID;
      post.languageID = '1';
      this.employerService.addDownloadsFolder(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close('success');
            }, 1000);
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public onEditFolder = (post: any) => {
    this.markFormTouched(this.editFolderForm);
    if (this.editFolderForm.valid) {
      this.spinner.show();
      post.loginemployerID = this.post.loginemployerID;
      post.employerdownloadID = this.post.employerdownloadID;
      post.languageID = '1';
      this.employerService.editDownloadFolder(post).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            setTimeout(() => {
              this.spinner.hide();
              this.activeModal.close('success');
            }, 1000);
          } else {
            this.spinner.hide();
            console.error(response[0].message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error(error);
        }
      );
    }
  }

  public markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
