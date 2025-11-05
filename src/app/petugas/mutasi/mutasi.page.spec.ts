import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MutasiPage } from './mutasi.page';

describe('MutasiPage', () => {
  let component: MutasiPage;
  let fixture: ComponentFixture<MutasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MutasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
