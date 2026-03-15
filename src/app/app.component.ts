import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App as CapacitorApp, type AppState } from '@capacitor/app';
import {
  PushNotifications,
  type ActionPerformed,
  type PushNotificationSchema,
  type Token,
} from '@capacitor/push-notifications';
import type { PluginListenerHandle } from '@capacitor/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotifikasiService } from './services/notifikasi.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly pushTokenStorageKey = 'fcm_push_token';
  private readonly enableNativeNotificationStartup = false;
  private appStateListener: PluginListenerHandle | null = null;
  private notificationActionListener: PluginListenerHandle | null = null;
  private pushRegistrationListener: PluginListenerHandle | null = null;
  private pushRegistrationErrorListener: PluginListenerHandle | null = null;
  private pushActionListener: PluginListenerHandle | null = null;
  
  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private notifikasiService: NotifikasiService,
    private websocketService: WebsocketService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }

  ngOnDestroy() {
    this.appStateListener?.remove();
    this.notificationActionListener?.remove();
    this.pushRegistrationListener?.remove();
    this.pushRegistrationErrorListener?.remove();
    this.pushActionListener?.remove();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Setup capacitor plugins for native Android/iOS
      if (this.platform.is('capacitor')) {
        try {
          // Jangan overlay webview agar konten tidak menembus ke area status bar.
          await StatusBar.setOverlaysWebView({ overlay: false });
          // Pakai ikon gelap agar kontras di background status bar terang.
          await StatusBar.setStyle({ style: Style.Dark });
        } catch (e) {
          console.error('Error setting status bar', e);
        }

        if (this.enableNativeNotificationStartup) {
          try {
            // Meminta izin push notification/local notification di OS
            const permStatus = await LocalNotifications.requestPermissions();
            console.log('Permission Notification:', permStatus.display);
          } catch (e) {
            console.error('Error requesting notification permission', e);
          }

          await this.setupNotificationListeners();
          await this.setupPushNotifications();
        }
        await this.syncRealtimeConnection(this.authService.isLoggedIn());
        if (this.enableNativeNotificationStartup) {
          await this.syncStoredPushToken();
        }

        this.appStateListener = await CapacitorApp.addListener('appStateChange', async (state: AppState) => {
          await this.syncRealtimeConnection(state.isActive && this.authService.isLoggedIn());
          if (this.enableNativeNotificationStartup && state.isActive) {
            await this.syncStoredPushToken();
          }
        });
      } else {
        await this.syncRealtimeConnection(this.authService.isLoggedIn());
      }
    });
  }

  private async setupNotificationListeners() {
    this.notificationActionListener = await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      async (event) => {
        const kegiatanId = event?.notification?.extra?.kegiatan_id;
        if (kegiatanId) {
          await this.router.navigate(['/petugas/detail-kegiatan', kegiatanId]);
        } else if (this.authService.isLoggedIn()) {
          await this.router.navigate(['/petugas/notifikasi']);
        }
      },
    );
  }

  private async setupPushNotifications() {
    try {
      const permissionStatus = await PushNotifications.checkPermissions();
      let receivePermission = permissionStatus.receive;

      if (receivePermission !== 'granted') {
        const requestPermission = await PushNotifications.requestPermissions();
        receivePermission = requestPermission.receive;
      }

      if (receivePermission !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      this.pushRegistrationListener = await PushNotifications.addListener(
        'registration',
        async (token: Token) => {
          const value = token?.value || '';
          if (!value) return;

          localStorage.setItem(this.pushTokenStorageKey, value);
          await this.syncPushTokenToBackend(value);
        },
      );

      this.pushRegistrationErrorListener = await PushNotifications.addListener(
        'registrationError',
        (error) => {
          console.error('Push registration error', error);
        },
      );

      this.pushActionListener = await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        async (event: ActionPerformed) => {
          const kegiatanId = event?.notification?.data?.kegiatan_id || event?.notification?.data?.id;

          if (kegiatanId) {
            await this.router.navigate(['/petugas/detail-kegiatan', kegiatanId]);
          } else if (this.authService.isLoggedIn()) {
            await this.router.navigate(['/petugas/notifikasi']);
          }
        },
      );

      await PushNotifications.addListener('pushNotificationReceived', (_notification: PushNotificationSchema) => {
        // Handler disiapkan agar notifikasi foreground tetap dapat diproses jika perlu pengembangan lanjutan.
      });

      await PushNotifications.register();
    } catch (error) {
      console.error('Error setting up push notifications', error);
    }
  }

  private async syncStoredPushToken() {
    const token = localStorage.getItem(this.pushTokenStorageKey);
    if (!token) return;

    await this.syncPushTokenToBackend(token);
  }

  private async syncPushTokenToBackend(token: string) {
    if (!this.authService.isLoggedIn()) return;

    await new Promise<void>((resolve) => {
      this.notifikasiService.registerPushToken(token).subscribe({
        next: () => resolve(),
        error: (err) => {
          console.error('Failed to register push token', err);
          resolve();
        },
      });
    });
  }

  private async syncRealtimeConnection(shouldConnect: boolean) {
    if (shouldConnect) {
      await this.websocketService.connect();
      return;
    }

    this.websocketService.disconnect();
  }
}
