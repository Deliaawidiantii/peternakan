import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.page.html',
  styleUrls: ['./otp-verify.page.scss'],
  standalone: false,
})
export class OtpVerifyPage implements OnInit {
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
  }

  async onVerify() {
    this.showError = false;
    this.errorMessage = '';

    if (!this.otp || this.otp.length !== 6) {
      this.showError = true;
      this.errorMessage = 'Kode OTP harus 6 digit';
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Memverifikasi...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.verifyOtp(this.otp).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          const alert = await this.alertController.create({
            header: 'Verifikasi Berhasil',
            message: response.message,
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
        } else {
          this.showError = true;
          this.errorMessage = response.message || 'Verifikasi gagal';
        }
      },
      error: async (error) => {
        await loading.dismiss();
        
        if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Kode OTP tidak valid';
        } else if (error.status === 0) {
          this.errorMessage = 'Tidak dapat terhubung ke server';
        } else {
          this.errorMessage = error.error?.message || 'Terjadi kesalahan';
        }
        
        this.showError = true;
      }
    });
  }
}