import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PenyakitService } from '../../../services/penyakit.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-daftar-penyakit',
  templateUrl: './daftar-penyakit.page.html',
  styleUrls: ['./daftar-penyakit.page.scss'],
  standalone: false,
})
export class DaftarPenyakitPage implements OnInit {
  kasusList: any[] = [];
  private backendUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private penyakitService: PenyakitService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadKasus();
  }

  ionViewWillEnter() {
    this.loadKasus();
  }

  async loadKasus() {
    const loading = await this.loadingCtrl.create({ message: 'Memuat daftar kasus...' });
    await loading.present();

    this.penyakitService.getPenyakit().subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.kasusList = Array.isArray(res?.data) ? res.data : [];
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: err?.error?.message || 'Gagal memuat daftar kasus penyakit',
          color: 'danger',
          duration: 2200,
        });
        await toast.present();
      },
    });
  }

  getFotoUrl(path?: string): string {
    if (!path) return 'assets/icon/penyakit1.jpg';
    if (path.startsWith('http')) return path;
    return `${this.backendUrl}/storage/${path}`;
  }

  getStatusClass(status: string): string {
    if (status === 'approved') return 'verified';
    if (status === 'rejected') return 'rejected';
    return 'waiting';
  }

  getStatusLabel(status: string): string {
    if (status === 'approved') return 'Terverifikasi';
    if (status === 'rejected') return 'Ditolak';
    return 'Menunggu Verifikasi';
  }

  goToDetail(kasus: any) {
    this.router.navigate(['/petugas/detail-penyakit'], {
      queryParams: { id: kasus.id },
    });
  }
}
