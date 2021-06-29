import { TestBed } from '@angular/core/testing';

import { LineageDetailService } from './lineage-detail.service';

describe('LineageDetailService', () => {
  let service: LineageDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineageDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
