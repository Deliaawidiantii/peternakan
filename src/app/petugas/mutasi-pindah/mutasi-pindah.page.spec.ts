import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MutasiPindahPage } from './mutasi-pindah.page';

describe('MutasiPindahPage', () => {
  let component: MutasiPindahPage;
  let fixture: ComponentFixture<MutasiPindahPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MutasiPindahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
