import { Injectable, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private echo: Echo<any> | null = null;
  public kegiatanCreated$ = new Subject<any>();

  constructor(
    private toastCtrl: ToastController,
    private ngZone: NgZone,
  ) {}

  async connect() {
    if (this.echo) return; // already connected

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

        // Trigger native OS local notification
        try {
          const generatedId = Math.floor(Math.random() * 10000) + 1; // 32-bit int safe
          await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Data Kegiatan Baru',
                body: `Anda mendapat tugas kegiatan baru: ${event.data?.jenis ?? 'Kegiatan'}`,
                id: generatedId,
                channelId: 'realtime-notif',
                schedule: { at: new Date(Date.now() + 500) }, // segera tunjukkan
                extra: { kegiatan_id: event.data?.id } // attach data as extra payload
              }
            ]
          });
        } catch (e) {
          console.error('Error triggering local notification', e);
        }

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

    console.log('✅ WebSocket connected to Reverb');
  }

  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      console.log('🔌 WebSocket disconnected');
    }
  }
}
