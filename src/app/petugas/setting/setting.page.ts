import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: false,
})
export class SettingPage implements OnInit {
  emailForm: FormGroup;
  passwordForm: FormGroup;
  notifikasiAktif: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Load preference
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          this.emailForm.patchValue({ email: user.email });
        }
      } catch (e) {}
    }
  }

  async simpanEmail() {
    if (this.emailForm.valid) {
      await this.showToast('Email berhasil diupdate', 'success');
    }
  }

  async simpanPassword() {
    if (this.passwordForm.valid) {
      await this.showToast('Password berhasil diupdate', 'success');
    }
  }

  async toggleNotifikasi() {
    const msg = this.notifikasiAktif
      ? 'Notifikasi diaktifkan'
      : 'Notifikasi dinonaktifkan';
    await this.showToast(msg, 'primary');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
