import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginDashboardGuard } from './login-dashboard.guard';

describe('loginDashboardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginDashboardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
