import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HewanPage } from './hewan.page';

describe('HewanPage', () => {
  let component: HewanPage;
  let fixture: ComponentFixture<HewanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HewanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
