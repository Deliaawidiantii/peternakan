import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenyakitPage } from './penyakit.page';

describe('PenyakitPage', () => {
  let component: PenyakitPage;
  let fixture: ComponentFixture<PenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
