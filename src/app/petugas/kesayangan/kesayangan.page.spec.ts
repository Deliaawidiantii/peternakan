import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KesayanganPage } from './kesayangan.page';

describe('KesayanganPage', () => {
  let component: KesayanganPage;
  let fixture: ComponentFixture<KesayanganPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KesayanganPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
