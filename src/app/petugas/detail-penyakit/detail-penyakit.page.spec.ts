import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPenyakitPage } from './detail-penyakit.page';

describe('DetailPenyakitPage', () => {
  let component: DetailPenyakitPage;
  let fixture: ComponentFixture<DetailPenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
