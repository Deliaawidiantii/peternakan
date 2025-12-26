import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputPerkawinanPage } from './input-perkawinan.page';

describe('InputPerkawinanPage', () => {
  let component: InputPerkawinanPage;
  let fixture: ComponentFixture<InputPerkawinanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPerkawinanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
