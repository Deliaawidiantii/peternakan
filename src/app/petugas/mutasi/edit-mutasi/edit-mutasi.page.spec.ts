import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMutasiPage } from './edit-mutasi.page';

describe('EditMutasiPage', () => {
  let component: EditMutasiPage;
  let fixture: ComponentFixture<EditMutasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMutasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
