import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PeternakService } from '../../../services/peternak.service';
import { PopulasiService } from '../../../services/populasi.service';
import { KandangService } from '../../../services/kandang.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail-pemilik',
  templateUrl: './detail-pemilik.page.html',
  styleUrls: ['./detail-pemilik.page.scss'],
  standalone: false,
})
export class DetailPemilikPage implements OnInit {
  peternakId: number | null = null;
  pemilik: any = null;
  isLoading: boolean = true;

  ternakList: any[] = [];
  kandangList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private peternakService: PeternakService,
    private populasiService: PopulasiService,
    private kandangService: KandangService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    // Ambil ID dari URL parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.peternakId = parseInt(id);
      this.loadDetailPemilik(this.peternakId);
    } else {
      // Kalau gak ada ID, redirect back
      this.navCtrl.back();
    }
  }

  async loadDetailPemilik(id: number) {
    this.isLoading = true;

    const loading = await this.loadingController.create({
      message: 'Memuat data...',
      spinner: 'crescent',
    });
    await loading.present();

    this.peternakService.getById(id).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.isLoading = false;

        if (response.success) {
          this.pemilik = response.data;
          console.log('Detail pemilik:', this.pemilik);

          // Load Kandang dan Ternak List
          this.loadTernakAndKandang(id);
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        console.error('Error loading detail:', error);

        let errorMessage = 'Gagal memuat data pemilik';

        if (error.status === 404) {
          errorMessage = 'Data pemilik tidak ditemukan';
        } else if (error.status === 401) {
          errorMessage = 'Sesi login berakhir. Silakan login kembali.';
          this.navCtrl.navigateRoot('/login');
        } else if (error.status === 0) {
          errorMessage = 'Tidak dapat terhubung ke server';
        }

        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.back();
              },
            },
          ],
        });
        await alert.present();
      },
    });
  }

  loadTernakAndKandang(peternakId: number) {
    this.populasiService
      .getPopulasi({ peternakan_id: peternakId })
      .subscribe((res: any) => {
        if (res.success && res.data) {
          this.ternakList = res.data;
        }
      });

    this.kandangService
      .getKandangByPeternak(peternakId)
      .subscribe((res: any) => {
        if (res.success && res.data) {
          this.kandangList = res.data;
        }
      });
  }

  // Format tanggal
  formatDate(dateString: string): string {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('id-ID', options);
  }

  // Navigate to edit
  goToEdit() {
    if (this.peternakId) {
      this.navCtrl.navigateForward(`/petugas/data-pemilik/${this.peternakId}`);
    }
  }

  // Delete pemilik
  async deletePemilik() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: `Apakah Anda yakin ingin menghapus data ${this.pemilik?.nama_peternak}?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Menghapus data...',
            });
            await loading.present();

            this.peternakService.delete(this.peternakId!).subscribe({
              next: async (response) => {
                await loading.dismiss();

                const successAlert = await this.alertController.create({
                  header: 'Berhasil',
                  message: 'Data pemilik berhasil dihapus',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.navigateBack('/petugas/pemilik');
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
