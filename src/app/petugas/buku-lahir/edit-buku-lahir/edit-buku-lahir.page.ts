import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-buku-lahir',
  templateUrl: './edit-buku-lahir.page.html',
  styleUrls: ['./edit-buku-lahir.page.scss'],
  standalone: false,
})
export class EditBukuLahirPage implements OnInit {
  editForm!: FormGroup;
  isSubmitting = false;
  anakHewanId = 'AN-S-KRW-0824-001';
  
  statusOptions = ['Normal', 'Abnormal', 'Diawasi'];

  // Data awal untuk reset
  private initialData = {
    tanggalLahir: '2024-08-18',
    idAnakHewan: 'AN-S-KRW-0824-001',
    kelompokHewan: 'Ruminansia',
    jenisHewan: 'Sapi',
    ras: 'Brahmana',
    jumlahAnak: 1,
    idInduk: 'IN-S-KRW-0034',
    jenisKelamin: 'Jantan',
    beratLahir: 10,
    statusKelahiran: 'Normal',
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  /**
   * Initialize form dengan data awal
   */
  private initializeForm() {
    this.editForm = this.formBuilder.group({
      tanggalLahir: [this.initialData.tanggalLahir, Validators.required],
      idAnakHewan: [this.initialData.idAnakHewan, Validators.required],
      kelompokHewan: [this.initialData.kelompokHewan, Validators.required],
      jenisHewan: [this.initialData.jenisHewan, Validators.required],
      ras: [this.initialData.ras, Validators.required],
      jumlahAnak: [this.initialData.jumlahAnak, [Validators.required, Validators.min(1)]],
      idInduk: [this.initialData.idInduk, Validators.required],
      jenisKelamin: [this.initialData.jenisKelamin, Validators.required],
      beratLahir: [this.initialData.beratLahir, [Validators.required, Validators.min(0)]],
      statusKelahiran: [this.initialData.statusKelahiran, Validators.required],
    });
  }

  /**
   * Submit form dan simpan data
   */
  async onSubmit() {
    if (!this.editForm.valid) {
      await this.showToast('Mohon lengkapi semua field yang diperlukan', 'warning');
      return;
    }

    this.isSubmitting = true;

    try {
      const formData = this.editForm.value;

      // Simulasi API call (ganti dengan service API Anda)
      await this.simulateApiCall(formData);

      // Simpan data ke service atau state management
      // this.dataService.updateKelahiran(formData).subscribe(...);

      await this.showToast('✅ Data kelahiran berhasil diperbarui!', 'success');

      // Kembali ke halaman detail setelah 1 detik
      setTimeout(() => {
        this.navController.back();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      await this.showToast('❌ Gagal menyimpan data. Coba lagi!', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Batal dan kembali ke form awal
   */
  async onBatal() {
    const hasChanges = JSON.stringify(this.editForm.value) !== JSON.stringify(this.initialData);

    if (hasChanges) {
      const alert = await this.alertController.create({
        header: 'Batalkan Perubahan?',
        message: 'Semua perubahan yang Anda buat akan hilang.',
        buttons: [
          {
            text: 'Lanjutkan Edit',
            role: 'cancel',
            handler: () => {
              console.log('Melanjutkan edit...');
            },
          },
          {
            text: 'Batalkan',
            role: 'destructive',
            handler: () => {
              this.resetForm();
              this.navController.back();
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.navController.back();
    }
  }

  /**
   * Reset form ke data awal
   */
  private resetForm() {
    this.editForm.reset(this.initialData);
  }

  /**
   * Tampilkan toast notification
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
      cssClass: 'custom-toast',
    });

    await toast.present();
  }

  /**
   * Simulasi API call (ganti dengan API service Anda)
   */
  private simulateApiCall(data: any): Promise<void> {
    return new Promise((resolve) => {
      console.log('Menyimpan data:', data);
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }
}