import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerkawinanPage } from './perkawinan.page';

describe('PerkawinanPage', () => {
  let component: PerkawinanPage;
  let fixture: ComponentFixture<PerkawinanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkawinanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
