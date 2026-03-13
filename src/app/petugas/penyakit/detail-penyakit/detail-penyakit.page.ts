import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { PenyakitService } from '../../../services/penyakit.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail-penyakit',
  templateUrl: './detail-penyakit.page.html',
  styleUrls: ['./detail-penyakit.page.scss'],
  standalone: false,
})
export class DetailPenyakitPage implements OnInit {
  kasus: any;
  loading = true;
  private backendUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private penyakitService: PenyakitService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadDetail();
  }

  ionViewWillEnter() {
    this.loadDetail();
  }

  async loadDetail() {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id) {
      this.loading = false;
      this.showToast('ID kasus tidak valid', 'danger');
      return;
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({ message: 'Memuat detail kasus...' });
    await loading.present();

    this.penyakitService.getPenyakitById(id).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.kasus = res?.data || null;
        this.loading = false;
      },
      error: async (err) => {
        await loading.dismiss();
        this.loading = false;
        this.showToast(err?.error?.message || 'Gagal memuat detail kasus', 'danger');
      },
    });
  }

  getFotoUrl(path?: string): string {
    if (!path) return 'assets/icon/penyakit1.jpg';
    if (path.startsWith('http')) return path;
    return `${this.backendUrl}/storage/${path}`;
  }

  isVerified(): boolean {
    return this.kasus?.status_validasi === 'approved';
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  openUpdateStatus() {
    if (!this.kasus?.id) return;
    this.router.navigate(['/petugas/update-status-penyakit'], {
      queryParams: { id: this.kasus.id },
    });
  }
}
