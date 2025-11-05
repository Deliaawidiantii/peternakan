import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailKandangPage } from './detail-kandang.page';

describe('DetailKandangPage', () => {
  let component: DetailKandangPage;
  let fixture: ComponentFixture<DetailKandangPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKandangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
