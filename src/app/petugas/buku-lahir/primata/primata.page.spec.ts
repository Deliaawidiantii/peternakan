import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimataPage } from './primata.page';

describe('PrimataPage', () => {
  let component: PrimataPage;
  let fixture: ComponentFixture<PrimataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
