import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PemilikPage } from './pemilik.page';

describe('PemilikPage', () => {
  let component: PemilikPage;
  let fixture: ComponentFixture<PemilikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PemilikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
