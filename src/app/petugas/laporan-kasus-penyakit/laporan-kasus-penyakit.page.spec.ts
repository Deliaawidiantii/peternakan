import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaporanKasusPenyakitPage } from './laporan-kasus-penyakit.page';

describe('LaporanKasusPenyakitPage', () => {
  let component: LaporanKasusPenyakitPage;
  let fixture: ComponentFixture<LaporanKasusPenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanKasusPenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
