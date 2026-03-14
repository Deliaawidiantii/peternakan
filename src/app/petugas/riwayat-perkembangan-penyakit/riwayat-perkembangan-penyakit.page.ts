import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { PenyakitService } from '../../services/penyakit.service';

@Component({
  selector: 'app-riwayat-perkembangan-penyakit',
  templateUrl: './riwayat-perkembangan-penyakit.page.html',
  styleUrls: ['./riwayat-perkembangan-penyakit.page.scss'],
  standalone: false,
})
export class RiwayatPerkembanganPenyakitPage implements OnInit {
  selectedComponent: string | null = null;
  semuaKasus: any[] = [];

  constructor(
    private penyakitService: PenyakitService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.selectedComponent = 'terdiagnosa';
  }

  ionViewWillEnter() {
    this.loadData();
  }

  private normalizeStatusPerkembangan(status: string | null | undefined): string {
    const normalized = String(status || '').toLowerCase().replace(/[^a-z]/g, '');

    if (normalized === 'dalamperkembangan') {
      return 'dalamPerkembangan';
    }

    if (['terdiagnosa', 'sembuh', 'mati', 'selesai'].includes(normalized)) {
      return normalized;
    }

    return 'terdiagnosa';
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({ message: 'Memuat data...' });
    await loading.present();

    this.penyakitService.getPenyakit().subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res.success || res.status === 'success') {
          const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
          this.semuaKasus = list.map((kasus: any) => ({
            ...kasus,
            status_perkembangan: this.normalizeStatusPerkembangan(kasus.status_perkembangan),
          }));
        }
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Gagal memuat riwayat penyakit',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  getFilteredKasus(status: string) {
    return this.semuaKasus.filter((kasus) => this.normalizeStatusPerkembangan(kasus.status_perkembangan) === status);
  }

  openComponent(componentName: string) {
    this.selectedComponent = componentName;
  }

  backToMain() {
    this.selectedComponent = null;
  }
}
