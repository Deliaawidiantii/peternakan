import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';
  successMessage: string = '';
  errorMessage: string[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async sendResetLink() {
    // Reset messages
    this.successMessage = '';
    this.errorMessage = [];
    
    // Validasi
    if (!this.email) {
      this.errorMessage.push('Email harus diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage.push('Format email tidak valid');
      return;
    }

    this.isLoading = true;

    // Call API
    this.authService.forgotPassword(this.email).subscribe({
      next: async (response) => {
        this.isLoading = false;
        
        if (response.success) {
          // Simpan email ke localStorage untuk step selanjutnya
          localStorage.setItem('reset_email', this.email);
          
          // Show alert dan redirect ke reset password page
          const alert = await this.alertController.create({
            header: 'OTP Terkirim',
            message: 'Kode OTP telah dikirim ke email Anda. Silakan periksa inbox atau folder spam.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  // Redirect ke halaman verify OTP
                  this.router.navigate(['/verify-reset-otp']);
                }
              }
            ]
          });
          await alert.present();
        }
      },
      error: async (error) => {
        this.isLoading = false;
        
        if (error.status === 404) {
          this.errorMessage.push('Email tidak terdaftar');
        } else if (error.status === 0) {
          this.errorMessage.push('Tidak dapat terhubung ke server');
        } else {
          this.errorMessage.push(error.error?.message || 'Terjadi kesalahan');
        }
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}