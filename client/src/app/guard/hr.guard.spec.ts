import { TestBed } from '@angular/core/testing';

import { HrGuard } from './hr.guard';

describe('HrGuard', () => {
  let guard: HrGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HrGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
