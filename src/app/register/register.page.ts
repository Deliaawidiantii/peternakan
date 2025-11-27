import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Sesuaikan path
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {

  form = {
    nama: '',
    nik: '',
    email: '',
    desa_binaan: '',
    no_telp: '',
    password: '',
    password_confirmation: ''
  }; 

  errors: string[] = []; // Pesan error 

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword; 
  }

  async onRegister() {
    console.log('Form dikirim:', this.form);

    // Reset pesan error
    this.errors = [];

    // Validasi client-side
    if (!this.form.nama) {
      this.errors.push('Nama harus diisi');
    }
    if (!this.form.nik) {
      this.errors.push('NIK harus diisi');
    }
    if (!this.form.email) {
      this.errors.push('Email harus diisi');
    }
    if (!this.form.desa_binaan) {
      this.errors.push('Desa Binaan harus diisi');
    }
    if (!this.form.password) {
      this.errors.push('Password harus diisi');
    }
    if (this.form.password !== this.form.password_confirmation) { 
      this.errors.push('Password dan konfirmasi password harus sama');
    }
    if (this.form.password && this.form.password.length < 6) {
      this.errors.push('Password minimal 6 karakter');
    }

    // Jika ada error, stop
    if (this.errors.length > 0) {
      return;
    }

    // Show loading
    const loading = await this.loadingController.create({
      message: 'Mendaftarkan akun...',
      spinner: 'crescent'
    });
    await loading.present();

    // Call API register
    this.authService.register(this.form).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          console.log('Register berhasil:', response.data);
          
          // Show success alert
        const alert = await this.alertController.create({
          header: 'Registrasi Berhasil',
          message: response.message || 'Kode OTP telah dikirim ke email Anda.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Redirect ke halaman OTP verify
                this.router.navigate(['/otp-verify']);
              }
            }
          ]
        });
          await alert.present();
        } else {
          this.errors.push(response.message || 'Registrasi gagal');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Register error:', error);
        
        // Reset errors
        this.errors = [];
        
        // Handle error dari server
        if (error.status === 422) {
          // Validation error dari Laravel
          const serverErrors = error.error.errors;
          if (serverErrors) {
            // Konversi error object jadi array
            Object.keys(serverErrors).forEach(key => {
              const errorMessages = serverErrors[key];
              if (Array.isArray(errorMessages)) {
                errorMessages.forEach(msg => {
                  // Translate pesan error ke Bahasa Indonesia
                  if (msg.includes('unique')) {
                    if (key === 'nik') {
                      this.errors.push('NIK sudah terdaftar');
                    } else if (key === 'email') {
                      this.errors.push('Email sudah terdaftar');
                    }
                  } else {
                    this.errors.push(msg);
                  }
                });
              }
            });
          } else {
            this.errors.push(error.error.message || 'Validasi gagal');
          }
        } else if (error.status === 0) {
          this.errors.push('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        } else {
          this.errors.push(error.error?.message || 'Terjadi kesalahan saat registrasi');
        }
      }
    });
  }
}