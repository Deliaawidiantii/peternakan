import { TestBed } from '@angular/core/testing';

import { KegiatanService } from './kegiatan.service';

describe('KegiatanService', () => {
  let service: KegiatanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KegiatanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
