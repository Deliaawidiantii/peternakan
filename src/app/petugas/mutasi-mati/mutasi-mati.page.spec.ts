import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MutasiMatiPage } from './mutasi-mati.page';

describe('MutasiMatiPage', () => {
  let component: MutasiMatiPage;
  let fixture: ComponentFixture<MutasiMatiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MutasiMatiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
