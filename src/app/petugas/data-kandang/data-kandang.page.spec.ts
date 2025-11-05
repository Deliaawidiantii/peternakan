import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataKandangPage } from './data-kandang.page';

describe('DataKandangPage', () => {
  let component: DataKandangPage;
  let fixture: ComponentFixture<DataKandangPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataKandangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
