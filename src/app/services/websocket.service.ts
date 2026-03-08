import { Injectable, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

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

  connect() {
    if (this.echo) return; // already connected

    // Make Pusher available globally (required by Laravel Echo)
    (window as any).Pusher = Pusher;

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
