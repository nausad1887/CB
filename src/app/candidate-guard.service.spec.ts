import { TestBed } from '@angular/core/testing';

import { CandidateGuardService } from './candidate-guard.service';

describe('CandidateGuardService', () => {
  let service: CandidateGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
