import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

interface BirthDetail {
  birthDate: string;
  childId: string;
  animalType: string;
  childCount: number;
  parentId: string;
  status: string;
}

@Component({
  selector: 'app-detail-kelahiran',
  templateUrl: './detail-kelahiran.page.html',
  styleUrls: ['./detail-kelahiran.page.scss'],
  standalone: false
})
export class DetailKelahiranPage implements OnInit {

  birthDetail: BirthDetail = {
    birthDate: '18 Agustus 2024',
    childId: 'AN-S-KRW-0824-001',
    animalType: 'Sapi',
    childCount: 1,
    parentId: 'IN-S-KRW-0034',
    status: 'Normal'
  };

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // nanti kalau sudah pakai backend → load data di sini
  }

  // ============================
  // KONFIRMASI HAPUS
  // ============================
  async deleteRecord() {
    const alert = await this.alertController.create({
      header: 'Hapus Catatan',
      message: 'Apakah Anda yakin ingin menghapus catatan kelahiran ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.confirmDelete();
          }
        }
      ]
    });

    await alert.present();
  }

  // ============================
  // LOGIC HAPUS CATATAN
  // ============================
  async confirmDelete() {
    const loading = await this.loadingCtrl.create({
      message: 'Menghapus catatan...'
    });
    await loading.present();

    try {
      // ========== LOGIC HAPUS =============
      // kalau nanti pakai backend → panggil DELETE API
      // this.birthService.deleteRecord(this.birthDetail.childId).subscribe(...)

      // sementara ini simulate delete
      console.log('Catatan dihapus:', this.birthDetail.childId);

      // ====================================
      await loading.dismiss();
      await this.showToast('Catatan berhasil dihapus.');

      // kembali ke list
      this.router.navigate(['/petugas/buku-lahir']);

    } catch (err) {
      console.error(err);
      await loading.dismiss();
      this.showToast('Gagal menghapus catatan.');
    }
  }

  async showToast(msg: string) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    t.present();
  }

  // ============================
  // EDIT
  // ============================
  editRecord() {
    console.log('Edit data:', this.birthDetail);
    // arahkan ke halaman edit
    // this.router.navigate(['/petugas/edit-kelahiran', this.birthDetail.childId]);
  }

}
