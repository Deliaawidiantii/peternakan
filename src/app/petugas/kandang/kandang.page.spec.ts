import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KandangPage } from './kandang.page';

describe('KandangPage', () => {
  let component: KandangPage;
  let fixture: ComponentFixture<KandangPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KandangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
