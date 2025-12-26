import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-input-pkb',
  templateUrl: './input-pkb.page.html',
  styleUrls: ['./input-pkb.page.scss'],
  standalone: false,
})
export class InputPKBPage implements OnInit {

  @ViewChild('pkbForm') pkbForm!: NgForm;

  formData = {
    // DATA PETUGAS
    namaPetugas: '',
    nikPetugas: '',
    telpPetugas: '',

    // DATA HEWAN
    eartagBetina: '',
    jenisTernak: '',
    rumpunTernak: '',
    umurInduk: null as number | null,

    // DATA PKB
    tanggalPKB: '',
    jenisPerkawinan: '',
    umurKebuntingan: null as number | null,
    prediksiLahir: '',

    // DATA PEMILIK
    namaPemilik: '',
    nikPemilik: '',

    // LOKASI
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    desa: '',
  };

  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    console.log('Input PKB Page initialized');
  }

  /**
   * Handle file selection untuk upload foto
   * @param event - Event dari input file
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Ukuran file terlalu besar! Maksimal 5MB', 'warning');
        event.target.value = '';
        return;
      }

      // Validasi tipe file
      if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
        this.showToast('Format file tidak didukung! Gunakan JPG, JPEG, atau PNG', 'warning');
        event.target.value = '';
        return;
      }

      this.selectedFile = file;

      // Preview image menggunakan FileReader
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);

      this.showToast('Foto berhasil dipilih', 'success');
    }
  }

  /**
   * Hitung prediksi tanggal lahir anak berdasarkan tanggal PKB dan umur kebuntingan
   * Masa bunting sapi sekitar 280 hari (9 bulan)
   */
  hitungPrediksiLahir() {
    if (this.formData.tanggalPKB && this.formData.umurKebuntingan !== null) {
      const tanggalPKB = new Date(this.formData.tanggalPKB);
      const umurKebuntingan = this.formData.umurKebuntingan;
      
      // Masa bunting sapi sekitar 9 bulan
      const sisaBulan = 9 - umurKebuntingan;
      
      if (sisaBulan > 0) {
        const prediksiDate = new Date(tanggalPKB);
        prediksiDate.setMonth(prediksiDate.getMonth() + sisaBulan);
        
        // Format ke YYYY-MM-DD untuk ion-input type="date"
        const year = prediksiDate.getFullYear();
        const month = String(prediksiDate.getMonth() + 1).padStart(2, '0');
        const day = String(prediksiDate.getDate()).padStart(2, '0');
        
        this.formData.prediksiLahir = `${year}-${month}-${day}`;
      } else {
        // Jika umur kebuntingan sudah 9 bulan atau lebih
        this.formData.prediksiLahir = this.formData.tanggalPKB;
        this.showToast('Umur kebuntingan sudah mencapai masa lahir', 'warning');
      }
    }
  }

  /**
   * Validasi NIK (harus 16 digit angka)
   * @param nik - Nomor Induk Kependudukan
   * @returns true jika valid
   */
  private validateNIK(nik: string): boolean {
    const nikRegex = /^\d{16}$/;
    return nikRegex.test(nik);
  }

  /**
   * Validasi nomor telepon Indonesia
   * @param telp - Nomor telepon
   * @returns true jika valid
   */
  private validateTelepon(telp: string): boolean {
    const telpRegex = /^(08|\+628)[0-9]{8,11}$/;
    return telpRegex.test(telp);
  }

  /**
   * Submit form data PKB
   */
  async submitForm() {
    // Validasi form menggunakan Angular Forms
    if (this.pkbForm.invalid) {
      await this.showAlert('Peringatan', 'Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    // Validasi tambahan NIK Petugas
    if (!this.validateNIK(this.formData.nikPetugas)) {
      await this.showAlert('Validasi Error', 'NIK Petugas harus 16 digit angka!');
      return;
    }

    // Validasi tambahan NIK Pemilik
    if (!this.validateNIK(this.formData.nikPemilik)) {
      await this.showAlert('Validasi Error', 'NIK Pemilik harus 16 digit angka!');
      return;
    }

    // Validasi nomor telepon
    if (!this.validateTelepon(this.formData.telpPetugas)) {
      await this.showAlert('Validasi Error', 'Format nomor telepon tidak valid! Contoh: 081234567890');
      return;
    }

    // Tampilkan loading
    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan data PKB...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loading.present();

    try {
      // Simulasi delay untuk proses penyimpanan
      await this.delay(1500);

      // Prepare data untuk dikirim ke API
      const submitData = {
        ...this.formData,
        foto: this.selectedFile ? {
          name: this.selectedFile.name,
          size: this.selectedFile.size,
          type: this.selectedFile.type
        } : null,
        timestamp: new Date().toISOString(),
        createdBy: 'mobile-app'
      };

      console.log('Data PKB yang akan disimpan:', submitData);

      // TODO: Implementasi API call untuk menyimpan data
      // Contoh:
      // const response = await this.pkbService.savePKB(submitData, this.selectedFile);
      // if (response.success) { ... }

      await loading.dismiss();
      
      // Tampilkan success message
      await this.showSuccessAlert();
      
      // Reset form setelah berhasil
      this.clearForm();

    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
      console.error('Error saving PKB data:', error);
    }
  }

  /**
   * Reset form dengan konfirmasi
   */
  async resetForm() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Reset',
      message: 'Apakah Anda yakin ingin mereset form? Semua data yang telah diisi akan hilang.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Ya, Reset',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.clearForm();
            this.showToast('Form berhasil direset', 'medium');
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Clear semua data form
   */
  private clearForm() {
    this.pkbForm.resetForm();
    this.formData = {
      namaPetugas: '',
      nikPetugas: '',
      telpPetugas: '',
      eartagBetina: '',
      jenisTernak: '',
      rumpunTernak: '',
      umurInduk: null,
      tanggalPKB: '',
      jenisPerkawinan: '',
      umurKebuntingan: null,
      prediksiLahir: '',
      namaPemilik: '',
      nikPemilik: '',
      provinsi: '',
      kabupaten: '',
      kecamatan: '',
      desa: ''
    };
    this.selectedFile = null;
    this.previewImage = null;
  }

  /**
   * Tampilkan alert success dengan styling khusus
   */
  private async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Berhasil!',
      message: 'Data PKB berhasil disimpan ke sistem.',
      cssClass: 'alert-success',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('Data PKB tersimpan');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Helper: Tampilkan alert dialog
   * @param header - Judul alert
   * @param message - Pesan alert
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  /**
   * Helper: Tampilkan toast notification
   * @param message - Pesan toast
   * @param color - Warna toast (primary, success, warning, danger)
   */
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Helper: Delay function untuk simulasi async operation
   * @param ms - Waktu delay dalam milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Ion lifecycle hook - dipanggil saat page akan ditampilkan
   */
  ionViewWillEnter() {
    console.log('Input PKB page will enter');
    // Bisa digunakan untuk load data atau refresh
  }

  /**
   * Ion lifecycle hook - dipanggil saat page akan di-leave
   */
  ionViewWillLeave() {
    console.log('Input PKB page will leave');
    // Bisa digunakan untuk cleanup atau save draft
  }
}