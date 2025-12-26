import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PKBPage } from './pkb.page';

describe('PKBPage', () => {
  let component: PKBPage;
  let fixture: ComponentFixture<PKBPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PKBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
