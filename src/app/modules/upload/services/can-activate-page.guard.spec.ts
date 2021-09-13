import { TestBed } from '@angular/core/testing';

import { CanActivatePageGuard } from './can-activate-page.guard';

describe('CanActivatePageGuard', () => {
  let guard: CanActivatePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivatePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
