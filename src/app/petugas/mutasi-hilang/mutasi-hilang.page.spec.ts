import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MutasiHilangPage } from './mutasi-hilang.page';

describe('MutasiHilangPage', () => {
  let component: MutasiHilangPage;
  let fixture: ComponentFixture<MutasiHilangPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MutasiHilangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
