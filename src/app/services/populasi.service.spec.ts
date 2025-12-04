import { TestBed } from '@angular/core/testing';

import { PopulasiService } from './populasi.service';

describe('PopulasiService', () => {
  let service: PopulasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
