import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage {
  email: string = '';
  successMessage: string = '';
  errorMessage: string[] = [];

  constructor() { }

  sendResetLink() {
    this.successMessage = '';
    this.errorMessage = [];

    if (!this.email) {
      this.errorMessage.push('Email Tidak Boleh Kosong.');
      return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage.push('Format Email Tidak Valid.');
      return;
    }

    // Simulate sending reset link
    setTimeout(() => {
      this.successMessage = 'Link Reset Password Telah Dikirim ke Email Anda.' + this.email;
      this.email = '';
    }, 1000);

}
}
