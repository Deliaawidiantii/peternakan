import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnggasPage } from './unggas.page';

describe('UnggasPage', () => {
  let component: UnggasPage;
  let fixture: ComponentFixture<UnggasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnggasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
