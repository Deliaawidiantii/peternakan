import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyResetOtpPage } from './verify-reset-otp.page';

describe('VerifyResetOtpPage', () => {
  let component: VerifyResetOtpPage;
  let fixture: ComponentFixture<VerifyResetOtpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyResetOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
