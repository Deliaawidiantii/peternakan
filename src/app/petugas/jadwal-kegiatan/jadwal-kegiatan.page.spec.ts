import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JadwalKegiatanPage } from './jadwal-kegiatan.page';

describe('JadwalKegiatanPage', () => {
  let component: JadwalKegiatanPage;
  let fixture: ComponentFixture<JadwalKegiatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JadwalKegiatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
