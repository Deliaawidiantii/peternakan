import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailHewanPage } from './detail-hewan.page';

describe('DetailHewanPage', () => {
  let component: DetailHewanPage;
  let fixture: ComponentFixture<DetailHewanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailHewanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
