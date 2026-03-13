import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PenyakitService } from '../../../services/penyakit.service';

@Component({
  selector: 'app-update-status-penyakit',
  templateUrl: './update-status-penyakit.page.html',
  styleUrls: ['./update-status-penyakit.page.scss'],
  standalone: false,
})
export class UpdateStatusPenyakitPage implements OnInit {
  kasusId: number | null = null;
  isSubmitting = false;

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

  async submit() {
    if (!this.kasusId || this.isSubmitting) {
      await this.showToast('ID kasus tidak ditemukan', 'danger');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan status...' });
    await loading.present();

    const formData = new FormData();
    formData.append('status_perkembangan', this.form.status_perkembangan);
    formData.append('status_penanganan', this.form.status_penanganan);
    if (this.form.catatan_pemantauan) {
      formData.append('catatan_pemantauan', this.form.catatan_pemantauan);
    }

    this.penyakitService.updateStatus(this.kasusId, formData).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;
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
      },
      error: async (err) => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(err?.error?.message || 'Gagal menyimpan status perkembangan', 'danger');
      },
    });
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
