import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestKegiatanPage } from './request-kegiatan.page';

describe('RequestKegiatanPage', () => {
  let component: RequestKegiatanPage;
  let fixture: ComponentFixture<RequestKegiatanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestKegiatanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
