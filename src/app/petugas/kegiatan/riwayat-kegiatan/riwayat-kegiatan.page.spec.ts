import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiwayatKegiatanPage } from './riwayat-kegiatan.page';

describe('RiwayatKegiatanPage', () => {
  let component: RiwayatKegiatanPage;
  let fixture: ComponentFixture<RiwayatKegiatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiwayatKegiatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
