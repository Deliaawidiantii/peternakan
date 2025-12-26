import { TestBed } from '@angular/core/testing';

import { RiwayatPerkawinanService } from './riwayat-perkawinan.service';

describe('RiwayatPerkawinanService', () => {
  let service: RiwayatPerkawinanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiwayatPerkawinanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
