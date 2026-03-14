import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
  query = '';
  isLoading = false;
  private backendUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private penyakitService: PenyakitService,
    private toastCtrl: ToastController,
    private router: Router,
  ) {}

  get filteredKasus(): any[] {
    const term = this.query.trim().toLowerCase();
    if (!term) {
      return this.kasusList;
    }

    return this.kasusList.filter((item) => {
      const text = [
        item?.code,
        item?.diagnosa,
        item?.jenis_penyakit,
        item?.gejala,
        item?.deskripsi,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(term);
    });
  }

  ngOnInit() {
    this.loadKasus();
  }

  ionViewWillEnter() {
    this.loadKasus();
  }

  async loadKasus() {
    this.isLoading = true;

    this.penyakitService.getPenyakit().subscribe({
      next: async (res) => {
        this.isLoading = false;
        this.kasusList = Array.isArray(res?.data) ? res.data : [];
      },
      error: async (err) => {
        this.isLoading = false;
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
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
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
