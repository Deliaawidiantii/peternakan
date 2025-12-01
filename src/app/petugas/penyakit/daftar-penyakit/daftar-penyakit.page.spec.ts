import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaftarPenyakitPage } from './daftar-penyakit.page';

describe('DaftarPenyakitPage', () => {
  let component: DaftarPenyakitPage;
  let fixture: ComponentFixture<DaftarPenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarPenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
