import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BukuLahirPage } from './buku-lahir.page';

describe('BukuLahirPage', () => {
  let component: BukuLahirPage;
  let fixture: ComponentFixture<BukuLahirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BukuLahirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
