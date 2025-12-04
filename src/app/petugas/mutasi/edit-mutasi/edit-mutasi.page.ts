import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, NavController } from '@ionic/angular';

interface Hewan {
  kelompokHewan: string;
  jenisHewan: string;
  ras: string;
  hewanId: string;
  umur: string;
  beratBadan: number;

}

interface Mutasi {
  tanggalMutasi: string;
  jenisMutasi: string;
  alasanMutasi: string;
  keterangan: string;
}

@Component({
  selector: 'app-edit-mutasi',
  templateUrl: './edit-mutasi.page.html',
  styleUrls: ['./edit-mutasi.page.scss'],
  standalone: false,
})
export class EditMutasiPage implements OnInit {
  editForm!: FormGroup;
  isSubmitting = false;
  hewanId = 'HEW-001';

  hewan: Hewan = {
    kelompokHewan: 'Ruminansia',
    jenisHewan: 'Sapi',
    ras: 'Brahmana',
    hewanId: 'HEW-001',
    umur: '3 Tahun',
    beratBadan: 450,
  };

  // data awak untuk reset 
  private innitialData = {
    tanggalMutasi: '2024-09-01',
    jenisMutasi: 'Penjualan',
    alasanMutasi: 'Butuh dana mendesak',
    keterangan: 'Mutasi ke peternak lain di luar kota',
  };

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private router: ActivatedRoute
  ) { }



  ngOnInit() {
    this.initializeForm();
    this.loadMutasiData();
  }


  // initialize form dengan data awal
  private initializeForm() {
    this.editForm = this.formBuilder.group({
      tanggalMutasi: [this.innitialData.tanggalMutasi, Validators.required],
      jenisMutasi: [this.innitialData.jenisMutasi, Validators.required],
      alasanMutasi: [this.innitialData.alasanMutasi, Validators.required],
      keterangan: [this.innitialData.keterangan],
    });
  }

  // load data mutasi (nanti kalau sudah pakai backend → load data di sini)
  private loadMutasiData() {

    console.log("Loading Mutasi Data...");
  }

  // submit form dan simpan perubahan
  async onSubmit() {
    if (!this.editForm.valid) {
      await this.showToast('Mohon lengkapi semua field yang diperlukan', 'warning');
      return;
    }
    this.isSubmitting = true;

    try{
      const formData = this.editForm.value;

      await this.simulateApiCall(formData);
      await this.showToast('Data mutasi berhasil disimpan', 'success');


      // kembali ke halaman detail 
      setTimeout(() => {
        this.navController.back();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      await this.showToast('Terjadi kesalahan saat menyimpan data', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  // batal dan kembali ke form awal 
  async onBatal() {
    const hasChages = JSON.stringify(this.editForm.value) !== JSON.stringify(this.innitialData);
    if (hasChages) {
      const alert = await this.alertController.create({
        header: 'Batalkan Perubahan',
        message: 'Apakah Anda yakin ingin membatalkan perubahan?',
        buttons: [
          {
            text: 'Tidak',
            role: 'cancel',
            handler: () => {
              console.log('Lanjutkan edit...');
            },
          },
          {
            text: 'Ya, Batalkan',
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

  // reset form ke data awal
  private resetForm() {
    this.editForm.reset(this.innitialData);
  }


  // tampilkan toast notification
  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
      cssClass: 'custom-toast',
    });
    await toast.present();
  }


  // simulate API call dengan delay
  private simulateApiCall(data: any): Promise<void> {
    return new Promise((resolve) => {
      console.log('Menyimpan data mutasi:', data);
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }

}
