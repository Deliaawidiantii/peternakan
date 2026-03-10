import { Component, OnInit } from '@angular/core';
import { NotifikasiService } from '../../services/notifikasi.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: false,
})
export class NotifikasiPage implements OnInit {
  notifikasiList: any[] = [];
  isLoading: boolean = true;
  unreadCount: number = 0;

  constructor(
    private notifikasiService: NotifikasiService,
    private toastCtrl: ToastController,
    private router: Router
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
          this.notifikasiList = res.data;
          this.unreadCount = res.unread_count;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  async markAsRead(item: any) {
    // Navigasi ke detail jika punya kegiatan ID
    const proceedToDetail = () => {
      const kegiatanId = item.data?.id || item.data?.kegiatan_id;
      if (kegiatanId && item.type.includes('Kegiatan')) {
        this.router.navigate(['/petugas/detail-kegiatan', kegiatanId]);
      }
    };

    if (item.read_at) {
      proceedToDetail();
      return;
    }

    this.notifikasiService.markAsRead(item.id).subscribe({
      next: (res) => {
        item.read_at = new Date().toISOString();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        proceedToDetail();
      },
    });
  }

  markAllAsRead() {
    if (this.unreadCount === 0) return;
    this.notifikasiService.markAllAsRead().subscribe({
      next: async (res) => {
        this.notifikasiList.forEach(
          (n) => (n.read_at = new Date().toISOString()),
        );
        this.unreadCount = 0;
        const toast = await this.toastCtrl.create({
          message: 'Semua notifikasi ditandai dibaca',
          duration: 2000,
          color: 'success',
        });
        toast.present();
      },
    });
  }

  getIconProps(type: string): any {
    switch (type) {
      case 'App\\Notifications\\PenyakitNotification':
        return { name: 'warning-outline', color: 'danger', bg: 'bg-red' };
      case 'App\\Notifications\\KegiatanNotification':
        return { name: 'calendar-outline', color: 'primary', bg: 'bg-blue' };
      case 'App\\Notifications\\PerkawinanNotification':
        return { name: 'heart-outline', color: 'success', bg: 'bg-green' };
      default:
        return {
          name: 'notifications-outline',
          color: 'medium',
          bg: 'bg-blue',
        };
    }
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' menit lalu';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' jam lalu';
    return Math.floor(seconds / 86400) + ' hari lalu';
  }
}
