import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ← Sesuaikan path
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  showPassword = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    // Reset error
    this.showError = false;
    this.errorMessage = '';

    // Validasi input
    if (!this.email || !this.password) {
      this.showError = true;
      this.errorMessage = 'Email dan password harus diisi';
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError = true;
      this.errorMessage = 'Format email tidak valid';
      return;
    }

    // Show loading
    const loading = await this.loadingController.create({
      message: 'Sedang login...',
      spinner: 'crescent'
    });
    await loading.present();

    // Call API login
    this.authService.login(this.email, this.password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          console.log('Login berhasil:', response.data.user);
          
          // Redirect ke halaman petugas
          this.router.navigate(['/petugas/tabs/home']);
          
          // Show success message (optional)
          const alert = await this.alertController.create({
            header: 'Berhasil',
            message: `Selamat datang, ${response.data.user.nama}!`,
            buttons: ['OK']
          });
          await alert.present();
        } else {
          this.showError = true;
          this.errorMessage = response.message || 'Login gagal';
        }
      },
      error: async (error) => {
  await loading.dismiss();
  console.error('Login error:', error);
  
  // Handle berbagai jenis error
  if (error.status === 401) {
    // Unauthorized - password salah
    this.errorMessage = error.error?.message || 'Email atau password salah';
  } else if (error.status === 403) {
    // Forbidden - bisa karena belum verifikasi atau bukan role petugas
    this.errorMessage = error.error?.message || 'Akses ditolak';
  } else if (error.status === 422) {
    // Validation error
    const errors = error.error.errors;
    if (errors) {
      // Gabungkan semua error messages tanpa .flat()
      const allErrors: string[] = [];
      Object.values(errors).forEach((errorArray: any) => {
        if (Array.isArray(errorArray)) {
          allErrors.push(...errorArray);
        }
      });
      this.errorMessage = allErrors.join(', ');
    } else {
      this.errorMessage = error.error.message || 'Validasi gagal';
    }
  } else if (error.status === 0) {
    // Network error
    this.errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  } else {
    // Error lainnya
    this.errorMessage = error.error?.message || 'Terjadi kesalahan saat login';
  }
  
  this.showError = true;
}
    });
  }
}