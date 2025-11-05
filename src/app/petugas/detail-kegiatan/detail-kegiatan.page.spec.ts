import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPetugasPage } from './detail-petugas.page';

describe('DetailPetugasPage', () => {
  let component: DetailPetugasPage;
  let fixture: ComponentFixture<DetailPetugasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPetugasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
