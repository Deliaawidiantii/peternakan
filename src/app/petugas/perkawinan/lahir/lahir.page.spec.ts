import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LahirPage } from './lahir.page';

describe('LahirPage', () => {
  let component: LahirPage;
  let fixture: ComponentFixture<LahirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LahirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
