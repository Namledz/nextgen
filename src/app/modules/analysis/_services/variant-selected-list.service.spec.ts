import { TestBed } from '@angular/core/testing';

import { VariantSelectedListService } from './variant-selected-list.service';

describe('VariantSelectedListService', () => {
  let service: VariantSelectedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantSelectedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
