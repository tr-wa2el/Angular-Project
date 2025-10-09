import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authServiceGuard } from './auth-service-guard';

describe('authServiceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authServiceGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
