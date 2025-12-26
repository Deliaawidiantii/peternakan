import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDataPKBPage } from './edit-data-pkb.page';

describe('EditDataPKBPage', () => {
  let component: EditDataPKBPage;
  let fixture: ComponentFixture<EditDataPKBPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDataPKBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
