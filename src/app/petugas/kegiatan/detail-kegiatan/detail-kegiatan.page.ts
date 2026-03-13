import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { KegiatanService } from '../../../services/kegiatan.service';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail-kegiatan',
  templateUrl: './detail-kegiatan.page.html',
  styleUrls: ['./detail-kegiatan.page.scss'],
  standalone: false,
})
export class DetailKegiatanPage implements OnInit {
  kegiatan: any;
  loading = true;
  isSubmitting = false;
  uploadedPhotos: { url: string; file: File; name: string; size: number }[] = [];
  baseUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private route: ActivatedRoute,
    private kegiatanService: KegiatanService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDetail(id);
  }

  // 🔁 PENTING: refresh saat balik halaman
  ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDetail(id);
  }

  getDetail(id: number) {
    this.loading = true;

    this.kegiatanService.getKegiatanById(id).subscribe({
      next: (res) => {
        this.kegiatan = res.data || res;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Gagal memuat detail kegiatan', 'danger');
      }
    });
  }

  getFotoUrl(path: string) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.baseUrl}/storage/${path}`;
  }

  canStart(): boolean {
    return this.kegiatan?.status === 'terjadwal' && !this.kegiatan?.terkunci_mulai;
  }

  isRunning(): boolean {
    return this.kegiatan?.status === 'sedang_berjalan' || this.kegiatan?.status_aktual === 'butuh_diselesaikan';
  }

  mulai() {
    if (!this.kegiatan?.id || this.isSubmitting) return;

    this.isSubmitting = true;
    this.kegiatanService.mulaiKegiatan(this.kegiatan.id).subscribe({
      next: async () => {
        await this.showToast('Kegiatan dimulai', 'success');
        this.isSubmitting = false;
        this.getDetail(this.kegiatan.id);
      },
      error: async (err) => {
        this.isSubmitting = false;
        await this.showToast(err?.error?.message || 'Kegiatan tidak bisa dimulai', 'danger');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    if (this.uploadedPhotos.length + files.length > 10) {
      this.showToast('Maksimal 10 foto', 'warning');
      input.value = '';
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        this.showToast('File harus berupa gambar', 'warning');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Ukuran file maksimal 5MB', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedPhotos.push({
          url: (e.target?.result as string) || '',
          file,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  async deletePhoto(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Hapus foto ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.uploadedPhotos.splice(index, 1);
          },
        },
      ],
    });

    await alert.present();
  }

  async selesai() {
    if (!this.kegiatan?.id || this.isSubmitting) return;

    if (this.uploadedPhotos.length === 0) {
      await this.showToast('Upload minimal 1 foto', 'warning');
      return;
    }

    this.isSubmitting = true;

    try {
      for (const photo of this.uploadedPhotos) {
        const formData = new FormData();
        formData.append('foto', photo.file);
        await lastValueFrom(this.kegiatanService.uploadLaporan(this.kegiatan.id, formData));
      }

      await lastValueFrom(this.kegiatanService.selesaikanKegiatan(this.kegiatan.id));
      await this.showToast('Kegiatan selesai dan laporan terkirim', 'success');
      this.uploadedPhotos = [];
      this.router.navigate(['/petugas/kegiatan']);
    } catch (err: any) {
      await this.showToast(err?.error?.message || 'Gagal menyelesaikan kegiatan', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' = 'primary',
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });

    await toast.present();
  }
}
