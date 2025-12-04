import { TestBed } from '@angular/core/testing';

import { KandangService } from './kandang.service';

describe('KandangService', () => {
  let service: KandangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KandangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
