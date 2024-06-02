import { TestBed } from '@angular/core/testing';

import { CookiMangementService } from './cookie-management.service';

describe('CookiMangementService', () => {
  let service: CookiMangementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiMangementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
