import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPemilikPage } from './data-pemilik.page';

describe('DataPemilikPage', () => {
  let component: DataPemilikPage;
  let fixture: ComponentFixture<DataPemilikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPemilikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
