import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPemilikPage } from './detail-pemilik.page';

describe('DetailPemilikPage', () => {
  let component: DetailPemilikPage;
  let fixture: ComponentFixture<DetailPemilikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPemilikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
