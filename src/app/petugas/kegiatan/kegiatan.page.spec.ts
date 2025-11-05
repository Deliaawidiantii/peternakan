import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KegiatanPage } from './kegiatan.page';

describe('KegiatanPage', () => {
  let component: KegiatanPage;
  let fixture: ComponentFixture<KegiatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KegiatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
