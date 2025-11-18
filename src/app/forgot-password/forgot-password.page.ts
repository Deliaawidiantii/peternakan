import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  isLoading: boolean = false;

  constructor(private router: Router) { }

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
    this.isLoading = true;
    setTimeout(() => {
      this.successMessage = 'Link Reset Password Telah Dikirim ke Email Anda.' + this.email;
      this.email = '';
      this.isLoading = false;

      // auto redirect ke login setelah 3 detik 
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }, 1500);

}

backToLogin() {
    this.router.navigate(['/login']);
  }
}
