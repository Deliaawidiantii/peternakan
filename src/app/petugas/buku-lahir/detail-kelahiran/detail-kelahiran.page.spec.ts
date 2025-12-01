import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailKelahiranPage } from './detail-kelahiran.page';

describe('DetailKelahiranPage', () => {
  let component: DetailKelahiranPage;
  let fixture: ComponentFixture<DetailKelahiranPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKelahiranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
