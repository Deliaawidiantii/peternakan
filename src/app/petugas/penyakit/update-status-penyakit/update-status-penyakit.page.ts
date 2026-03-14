import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PenyakitService } from '../../../services/penyakit.service';

@Component({
  selector: 'app-update-status-penyakit',
  templateUrl: './update-status-penyakit.page.html',
  styleUrls: ['./update-status-penyakit.page.scss'],
  standalone: false,
})
export class UpdateStatusPenyakitPage implements OnInit {
  kasusId: number | null = null;
  kasus: any = null;
  isSubmitting = false;
  isLoadingKasus = false;

  form = {
    status_perkembangan: 'dalamPerkembangan',
    status_penanganan: 'dalam_perawatan',
    catatan_pemantauan: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private penyakitService: PenyakitService,
  ) {}

  ngOnInit() {
    this.kasusId = Number(this.route.snapshot.queryParamMap.get('id')) || null;
  }

  ionViewWillEnter() {
    this.kasusId = Number(this.route.snapshot.queryParamMap.get('id')) || null;
    this.loadKasus();
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

  private async loadKasus() {
    if (!this.kasusId || this.isLoadingKasus) {
      return;
    }

    this.isLoadingKasus = true;

    try {
      const response = await firstValueFrom(this.penyakitService.getPenyakitById(this.kasusId));
      this.kasus = response?.data || null;

      if (this.kasus) {
        this.form = {
          status_perkembangan: this.normalizeStatusPerkembangan(this.kasus.status_perkembangan),
          status_penanganan: this.kasus.status_penanganan || 'dalam_perawatan',
          catatan_pemantauan: this.kasus.catatan_pemantauan || '',
        };
      }
    } catch (err: any) {
      await this.showToast(err?.error?.message || 'Gagal memuat data kasus penyakit', 'danger');
    } finally {
      this.isLoadingKasus = false;
    }
  }

  isApprovedCase(): boolean {
    return this.kasus?.status_validasi === 'approved';
  }

  async submit() {
    if (!this.kasusId || this.isSubmitting) {
      await this.showToast('ID kasus tidak ditemukan', 'danger');
      return;
    }

    if (!this.isApprovedCase()) {
      await this.showToast('Kasus belum approved, status belum bisa diperbarui.', 'warning');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan status...' });
    await loading.present();

    try {
      await firstValueFrom(this.penyakitService.updateStatus(this.kasusId, this.form));

      const alert = await this.alertController.create({
        header: 'Berhasil',
        message: 'Status perkembangan penyakit berhasil diperbarui.',
        buttons: ['OK'],
        cssClass: 'custom-alert',
      });
      await alert.present();
      await alert.onDidDismiss();

      this.router.navigate(['/petugas/detail-penyakit'], {
        queryParams: { id: this.kasusId },
      });
    } catch (err: any) {
      const validationErrors = err?.error?.errors
        ? Object.values(err.error.errors).reduce((acc: string[], value: any) => acc.concat(value as string[]), [])
        : [];
      const message = validationErrors.length
        ? validationErrors.join(', ')
        : err?.error?.message || 'Gagal menyimpan status perkembangan';
      await this.showToast(message, 'danger');
    } finally {
      await loading.dismiss();
      this.isSubmitting = false;
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
