import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-decline-modal',
  templateUrl: './decline-modal.component.html',
  styleUrls: ['./decline-modal.component.css'],
})
export class DeclineModalComponent implements OnInit {
  @Input() declineData: any;
  public reasonsLists = [];
  declineForm: FormGroup;
  declineReasonLists$: Observable<Array<any>>;
  constructor(
    public candidateService: CandidateService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    fb: FormBuilder
  ) {
    this.declineForm = fb.group({
      reasonsID: ['', Validators.compose([Validators.required])],
      reasonsRemark: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
    });
  }

  ngOnInit(): void {
    this.getReasonsLists();
  }
  public onClose = () => {
    this.activeModal.close('closedByManually');
  }
  public getReasonsLists = () => {
    this.declineReasonLists$ = this.candidateService.getInterviewReasonsLists;
    this.declineReasonLists$.subscribe(
      (response) => {
        if (response[0].status === 'true') {
          this.reasonsLists = response[0].data;
        } else {
          console.error(response[0].message);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  public onClickDecline = (post: any) => {
    this.spinner.show();
    this.declineData.reasonID = post.reasonsID;
    this.declineData.interviewRejectRemarks = post.reasonsRemark;
    if (this.declineForm.valid) {
      this.candidateService.rejectInterview(this.declineData).subscribe(
        (response) => {
          if (response[0].status === 'true') {
            this.declineData.from === 'request'
              ? this.activeModal.close('request')
              : this.declineData.from === 'selected'
              ? this.activeModal.close('selected')
              : this.declineData.from === 'rescheduled'
              ? this.activeModal.close('rescheduled')
              : this.activeModal.close('schedule');
            setTimeout(() => {
              this.spinner.hide();
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
    } else {
      this.spinner.hide();
    }
  }
}
