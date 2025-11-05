import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformasiPage } from './informasi.page';

describe('InformasiPage', () => {
  let component: InformasiPage;
  let fixture: ComponentFixture<InformasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
