import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputDataPage } from './input-data.page';

describe('InputDataPage', () => {
  let component: InputDataPage;
  let fixture: ComponentFixture<InputDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
