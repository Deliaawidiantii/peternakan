import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPKBPage } from './detail-pkb.page';

describe('DetailPKBPage', () => {
  let component: DetailPKBPage;
  let fixture: ComponentFixture<DetailPKBPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPKBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
