import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataHewanPage } from './data-hewan.page';

describe('DataHewanPage', () => {
  let component: DataHewanPage;
  let fixture: ComponentFixture<DataHewanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHewanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
