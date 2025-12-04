import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBukuLahirPage } from './edit-buku-lahir.page';

describe('EditBukuLahirPage', () => {
  let component: EditBukuLahirPage;
  let fixture: ComponentFixture<EditBukuLahirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBukuLahirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
