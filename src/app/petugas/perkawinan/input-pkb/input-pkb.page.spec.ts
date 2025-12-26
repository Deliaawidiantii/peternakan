import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputPKBPage } from './input-pkb.page';

describe('InputPKBPage', () => {
  let component: InputPKBPage;
  let fixture: ComponentFixture<InputPKBPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPKBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
