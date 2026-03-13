import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // ✅ TAMBAH INI
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular'; // ✅ TAMBAH INI
import { KandangService } from '../../../services/kandang.service'; // ✅ TAMBAH INI

@Component({
  selector: 'app-detail-kandang',
  templateUrl: './detail-kandang.page.html',
  styleUrls: ['./detail-kandang.page.scss'],
  standalone: false,
})
export class DetailKandangPage implements OnInit {
  
  // ✅ TAMBAH: Variable untuk data kandang
  kandang: any = null;
  isLoading = false;
  kandangId: number = 0;

  constructor(
    private route: ActivatedRoute, // ✅ TAMBAH
    private kandangService: KandangService, // ✅ TAMBAH
    private loadingCtrl: LoadingController, // ✅ TAMBAH
    private toastCtrl: ToastController, // ✅ TAMBAH
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // ✅ TAMBAH: Ambil ID dari URL parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.kandangId = parseInt(id);
      this.loadKandangDetail();
    }
  }

  // ✅ TAMBAH: Method load data dari API
  async loadKandangDetail() {
    this.isLoading = true;

    const loading = await this.loadingCtrl.create({
      message: 'Memuat detail kandang...'
    });
    await loading.present();

    this.kandangService.getKandangById(this.kandangId).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.isLoading = false;

        if (response.success) {
          this.kandang = response.data;
          console.log('Detail kandang:', this.kandang);
        } else {
          await this.showToast('Gagal memuat data', 'danger');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        console.error('Error:', error);
        await this.showToast('Terjadi kesalahan saat memuat data', 'danger');
      }
    });
  }

  // ✅ TAMBAH: Show toast
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  hasValidCoordinates(): boolean {
    const raw = this.kandang?.titik_kordinat;
    if (!raw || typeof raw !== 'string') return false;

    const parts = raw.split(',').map((v: string) => v.trim());
    if (parts.length !== 2) return false;

    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    return !Number.isNaN(lat) && !Number.isNaN(lng);
  }

  getGoogleMapsUrl(): string {
    if (!this.hasValidCoordinates()) return '#';
    const parts = this.kandang.titik_kordinat.split(',').map((v: string) => v.trim());
    return `https://www.google.com/maps?q=${parts[0]},${parts[1]}`;
  }

  // Navigate to edit
  goToEdit() {
    if (this.kandangId) {
      this.navCtrl.navigateForward(`/petugas/data-kandang/${this.kandangId}`);
    }
  }

  // Delete kandang
  async deleteKandang() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: `Apakah Anda yakin ingin menghapus data kandang ${this.kandang?.nama_kandang}?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Menghapus data...',
            });
            await loading.present();

            this.kandangService.deleteKandang(this.kandangId).subscribe({
              next: async (response) => {
                await loading.dismiss();

                const successAlert = await this.alertController.create({
                  header: 'Berhasil',
                  message: 'Data kandang berhasil dihapus',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.navigateBack('/petugas/kandang');
                      },
                    },
                  ],
                });
                await successAlert.present();
              },
              error: async (error) => {
                await loading.dismiss();

                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Gagal menghapus data',
                  buttons: ['OK'],
                });
                await errorAlert.present();
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}