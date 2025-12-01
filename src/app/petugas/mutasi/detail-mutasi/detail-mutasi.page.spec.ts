import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailMutasiPage } from './detail-mutasi.page';

describe('DetailMutasiPage', () => {
  let component: DetailMutasiPage;
  let fixture: ComponentFixture<DetailMutasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMutasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
