import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AktaLahirPage } from './akta-lahir.page';

describe('AktaLahirPage', () => {
  let component: AktaLahirPage;
  let fixture: ComponentFixture<AktaLahirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AktaLahirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
