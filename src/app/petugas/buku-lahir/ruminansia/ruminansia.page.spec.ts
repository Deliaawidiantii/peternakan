import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuminansiaPage } from './ruminansia.page';

describe('RuminansiaPage', () => {
  let component: RuminansiaPage;
  let fixture: ComponentFixture<RuminansiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RuminansiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
