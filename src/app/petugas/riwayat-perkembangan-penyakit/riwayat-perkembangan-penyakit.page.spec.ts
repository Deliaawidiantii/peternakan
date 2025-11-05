import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiwayatPerkembanganPenyakitPage } from './riwayat-perkembangan-penyakit.page';

describe('RiwayatPerkembanganPenyakitPage', () => {
  let component: RiwayatPerkembanganPenyakitPage;
  let fixture: ComponentFixture<RiwayatPerkembanganPenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiwayatPerkembanganPenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
