import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify-reset-otp',
  templateUrl: './verify-reset-otp.page.html',
  styleUrls: ['./verify-reset-otp.page.scss'],
  standalone: false,
})
export class VerifyResetOtpPage implements OnInit {
  email: string = '';
  otp: string = '';
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Ambil email dari localStorage
    const savedEmail = localStorage.getItem('reset_email');
    if (savedEmail) {
      this.email = savedEmail;
    } else {
      // Kalau gak ada email, redirect ke forgot password
      this.router.navigate(['/forgot-password']);
    }
  }

  async verifyOtp() {
    this.showError = false;
    this.errorMessage = '';

    // Validasi
    if (!this.otp || this.otp.length !== 6) {
      this.showError = true;
      this.errorMessage = 'Kode OTP harus 6 digit';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Memverifikasi OTP...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.verifyResetOtp(this.email, this.otp).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          // Simpan OTP ke localStorage untuk step selanjutnya
          localStorage.setItem('reset_otp', this.otp);
          
          // Redirect ke halaman reset password
          const alert = await this.alertController.create({
            header: 'OTP Valid',
            message: 'Kode OTP berhasil diverifikasi. Silakan masukkan password baru Anda.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.router.navigate(['/reset-password']);
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
          this.errorMessage = error.error?.message || 'Kode OTP tidak valid atau sudah kadaluarsa';
        } else if (error.status === 0) {
          this.errorMessage = 'Tidak dapat terhubung ke server';
        } else {
          this.errorMessage = error.error?.message || 'Terjadi kesalahan';
        }
        
        this.showError = true;
      }
    });
  }

  goBack() {
    this.router.navigate(['/forgot-password']);
  }
}