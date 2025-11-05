import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateStatusPenyakitPage } from './update-status-penyakit.page';

describe('UpdateStatusPenyakitPage', () => {
  let component: UpdateStatusPenyakitPage;
  let fixture: ComponentFixture<UpdateStatusPenyakitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusPenyakitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
