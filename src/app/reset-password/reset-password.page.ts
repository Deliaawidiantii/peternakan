import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  email: string = '';
  otp: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Ambil email dan OTP dari localStorage
    const savedEmail = localStorage.getItem('reset_email');
    const savedOtp = localStorage.getItem('reset_otp');
    
    if (savedEmail && savedOtp) {
      this.email = savedEmail;
      this.otp = savedOtp;
    } else {
      // Kalau gak ada, redirect ke forgot password
      this.router.navigate(['/forgot-password']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async resetPassword() {
    this.showError = false;
    this.errorMessage = '';

    // Validasi
    if (!this.password) {
      this.showError = true;
      this.errorMessage = 'Password harus diisi';
      return;
    }

    if (this.password.length < 6) {
      this.showError = true;
      this.errorMessage = 'Password minimal 6 karakter';
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.showError = true;
      this.errorMessage = 'Password dan konfirmasi password harus sama';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mereset password...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.resetPassword(this.email, this.otp, this.password, this.passwordConfirmation).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          // Hapus data dari localStorage
          localStorage.removeItem('reset_email');
          localStorage.removeItem('reset_otp');
          
          const alert = await this.alertController.create({
            header: 'Berhasil',
            message: 'Password berhasil direset. Silakan login dengan password baru Anda.',
            buttons: [
              {
                text: 'Login Sekarang',
                handler: () => {
                  this.router.navigate(['/login']);
                }
              }
            ]
          });
          await alert.present();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        
        if (error.status === 400) {
          this.errorMessage = 'Sesi sudah kadaluarsa. Silakan mulai dari awal.';
          
          // Hapus data dan redirect
          localStorage.removeItem('reset_email');
          localStorage.removeItem('reset_otp');
          
          setTimeout(() => {
            this.router.navigate(['/forgot-password']);
          }, 2000);
        } else if (error.status === 422) {
          const errors = error.error.errors;
          if (errors) {
            const allErrors: string[] = [];
            Object.values(errors).forEach((errorArray: any) => {
              if (Array.isArray(errorArray)) {
                allErrors.push(...errorArray);
              }
            });
            this.errorMessage = allErrors.join(', ');
          }
        } else {
          this.errorMessage = error.error?.message || 'Terjadi kesalahan';
        }
        
        this.showError = true;
      }
    });
  }
}