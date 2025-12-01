import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MulaiKegiatanPage } from './mulai-kegiatan.page';

describe('MulaiKegiatanPage', () => {
  let component: MulaiKegiatanPage;
  let fixture: ComponentFixture<MulaiKegiatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MulaiKegiatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
