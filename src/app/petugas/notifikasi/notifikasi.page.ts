import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotifikasiService } from '../../services/notifikasi.service';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: false,
})
export class NotifikasiPage implements OnInit {
  notifikasiList: any[] = [];
  isLoading = true;
  unreadCount = 0;

  constructor(
    private notifikasiService: NotifikasiService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadNotifikasi();
  }

  ionViewWillEnter() {
    this.loadNotifikasi();
  }

  loadNotifikasi() {
    this.isLoading = true;
    this.notifikasiService.getNotifikasi().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.notifikasiList = Array.isArray(res.data) ? res.data : [];
          this.unreadCount = res.unread_count || 0;
        }
        this.isLoading = false;
      },
      error: async (err) => {
        console.error(err);
        this.isLoading = false;
        await this.presentToast('Gagal memuat notifikasi', 'danger');
      },
    });
  }

  async markAsRead(item: any) {
    const goToDetail = () => {
      const kegiatanId = item.data?.id || item.data?.kegiatan_id;
      if (kegiatanId && String(item.type || '').includes('Kegiatan')) {
        this.router.navigate(['/petugas/detail-kegiatan', kegiatanId]);
      }
    };

    if (item.read_at) {
      goToDetail();
      return;
    }

    this.notifikasiService.markAsRead(item.id).subscribe({
      next: () => {
        item.read_at = new Date().toISOString();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        goToDetail();
      },
      error: async () => {
        await this.presentToast('Gagal memperbarui status notifikasi', 'danger');
      },
    });
  }

  async deleteNotifikasi(item: any, event: Event) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Hapus notifikasi',
      message: 'Notifikasi ini akan dihapus dari daftar. Lanjutkan?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.notifikasiService.deleteNotifikasi(item.id).subscribe({
              next: async () => {
                this.notifikasiList = this.notifikasiList.filter((notif) => notif.id !== item.id);
                if (!item.read_at) {
                  this.unreadCount = Math.max(0, this.unreadCount - 1);
                }
                await this.presentToast('Notifikasi berhasil dihapus', 'success');
              },
              error: async () => {
                await this.presentToast('Gagal menghapus notifikasi', 'danger');
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  markAllAsRead() {
    if (this.unreadCount === 0) {
      return;
    }

    this.notifikasiService.markAllAsRead().subscribe({
      next: async () => {
        this.notifikasiList = this.notifikasiList.map((item) => ({
          ...item,
          read_at: item.read_at || new Date().toISOString(),
        }));
        this.unreadCount = 0;
        await this.presentToast('Semua notifikasi ditandai dibaca', 'success');
      },
      error: async () => {
        await this.presentToast('Gagal menandai semua notifikasi', 'danger');
      },
    });
  }

  getIconProps(type: string): { name: string; bg: string } {
    switch (type) {
      case 'App\\Notifications\\PenyakitNotification':
        return { name: 'medkit-outline', bg: 'bg-red' };
      case 'App\\Notifications\\KegiatanNotification':
        return { name: 'calendar-outline', bg: 'bg-blue' };
      case 'App\\Notifications\\PerkawinanNotification':
        return { name: 'heart-outline', bg: 'bg-green' };
      default:
        return { name: 'notifications-outline', bg: 'bg-blue' };
    }
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'Baru saja';
    }
    if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} menit lalu`;
    }
    if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} jam lalu`;
    }
    return `${Math.floor(seconds / 86400)} hari lalu`;
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
