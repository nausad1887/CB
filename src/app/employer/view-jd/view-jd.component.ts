import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-jd',
  templateUrl: './view-jd.component.html',
  styleUrls: ['./view-jd.component.css']
})
export class ViewJdComponent implements OnInit {
  @Input() jobJD: any;
  editPostJDform: FormGroup;
  public selectedSkills = [];
  public jdUrl = 'http://betaapplication.com/candidatebazar/backend/web/uploads';
  public postJDjobType = [
    'Full Time',
    'Half Days',
    'Work from Home',
    '2 Hrs only',
  ];
  public expYears = [
    { id: '0.00', value: 'Fresher' },
    { id: '1.00', value: '1 Years' },
    { id: '2.00', value: '2 Years' },
    { id: '3.00', value: '3 Years' },
    { id: '4.00', value: '4 Years' },
    { id: '5.00', value: '5 Years & Above' },
  ];
  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.editPostJDform = this.fb.group({
      jobjdName: [this.jobJD.jobjdName],
      city: [this.jobJD.cityName ? this.jobJD.cityName : ''],
      salaryrange: [this.jobJD.salaryrangeName ? this.jobJD.salaryrangeName : ''],
      jobjdexperiance: [this.jobJD.jobjdexperiance ? this.expYears.filter(exp => exp.id === this.jobJD.jobjdexperiance)[0].value : ''],
      notice: [this.jobJD.noticeName ? this.jobJD.noticeName : ''],
      degree: [this.jobJD.degreeName ? this.jobJD.degreeName : ''],
      jobjdOpenings: [this.jobJD.jobjdOpenings ? this.jobJD.jobjdOpenings : ''],
      jobjdJobType: [this.jobJD.jobjdJobType ? this.jobJD.jobjdJobType : ''],
      jobjdCertificatation: [this.jobJD.jobjdCertificatation],
      jobjdDescription: [this.jobJD.jobjdDescription],
    });
    this.selectedSkills = this.jobJD.jdskills;
  }

  onClose() {
    this.activeModal.close();
  }
}
