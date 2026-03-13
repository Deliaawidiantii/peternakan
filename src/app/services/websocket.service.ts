import { Injectable, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotifikasiService } from './notifikasi.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private echo: Echo<any> | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private notifiedIds = new Set<string>();
  private readonly notifiedStorageKey = 'local_notified_notification_ids';
  public kegiatanCreated$ = new Subject<any>();

  constructor(
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private notifikasiService: NotifikasiService,
  ) {}

  async connect() {
    if (this.echo) return; // already connected
    this.loadNotifiedIds();

    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }
    } catch (e) {
      console.warn('Unable to verify local notification permissions', e);
    }

    // Make Pusher available globally (required by Laravel Echo)
    (window as any).Pusher = Pusher;

    // Buat Notification Channel untuk Android 8+ agar notifikasi memunculkan banner popup (heads-up)
    try {
      await LocalNotifications.createChannel({
        id: 'realtime-notif',
        name: 'Realtime Notifications',
        description: 'Notifikasi real-time dari server',
        importance: 5, // 5 = MAX importance (memunculkan Heads-Up popdown & suara)
        visibility: 1, // Public visibility
      });
    } catch(e) { /* channel creation failure is fine on iOS/web */ }

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.key,
      wsHost: environment.reverb.wsHost,
      wsPort: environment.reverb.wsPort,
      wssPort: environment.reverb.wsPort,
      forceTLS: environment.reverb.forceTLS,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
    });

    // Listen for new kegiatan
    this.echo.channel('kegiatan').listen('.kegiatan.created', (event: any) => {
      this.ngZone.run(async () => {
        console.log('🔔 Kegiatan baru received:', event);

        this.kegiatanCreated$.next(event);

        await this.triggerLocalNotification(
          'Data Kegiatan Baru',
          `Anda mendapat tugas kegiatan baru: ${event.data?.jenis ?? 'Kegiatan'}`,
          event.data?.id,
        );

        // Show toast notification
        const toast = await this.toastCtrl.create({
          message: `📋 Kegiatan baru: ${event.data?.jenis ?? 'Tugas baru'}`,
          duration: 4000,
          position: 'top',
          color: 'primary',
          buttons: [{ text: 'OK', role: 'cancel' }],
        });
        await toast.present();
      });
    });

    this.startUnreadNotificationPolling();
    console.log('✅ WebSocket connected to Reverb');
  }

  disconnect() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      console.log('🔌 WebSocket disconnected');
    }
  }

  private startUnreadNotificationPolling() {
    if (this.pollTimer) return;

    this.checkUnreadNotifications();
    this.pollTimer = setInterval(() => {
      this.checkUnreadNotifications();
    }, 30000);
  }

  private checkUnreadNotifications() {
    if (!localStorage.getItem('token')) return;

    this.notifikasiService.getNotifikasi().subscribe({
      next: async (res: any) => {
        const items = Array.isArray(res?.data) ? res.data : [];

        for (const item of items) {
          const notificationId = String(item?.id ?? '');
          const kegiatanId = item?.data?.kegiatan_id ?? item?.data?.id;

          if (!notificationId || item?.read_at || this.notifiedIds.has(notificationId)) {
            continue;
          }

          const title = item?.type?.includes('Kegiatan')
            ? 'Pengingat Kegiatan'
            : 'Notifikasi Baru';
          const body = item?.data?.message || item?.data?.judul || 'Anda punya notifikasi baru.';

          await this.triggerLocalNotification(title, body, kegiatanId);
          this.notifiedIds.add(notificationId);
        }

        this.persistNotifiedIds();
      },
      error: (err) => {
        console.error('Unread notification polling error', err);
      },
    });
  }

  private async triggerLocalNotification(title: string, body: string, kegiatanId?: number | string) {
    try {
      const generatedId = Math.floor(Math.random() * 1000000) + 1;
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: generatedId,
            channelId: 'realtime-notif',
            schedule: { at: new Date(Date.now() + 500) },
            extra: { kegiatan_id: kegiatanId },
          },
        ],
      });
    } catch (e) {
      console.error('Error triggering local notification', e);
    }
  }

  private loadNotifiedIds() {
    try {
      const raw = localStorage.getItem(this.notifiedStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        this.notifiedIds = new Set(parsed.map((id) => String(id)));
      }
    } catch {
      this.notifiedIds = new Set<string>();
    }
  }

  private persistNotifiedIds() {
    try {
      const ids = Array.from(this.notifiedIds);
      const capped = ids.slice(Math.max(ids.length - 200, 0));
      localStorage.setItem(this.notifiedStorageKey, JSON.stringify(capped));
      this.notifiedIds = new Set(capped);
    } catch {
      // Ignore storage failure.
    }
  }
}
