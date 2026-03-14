import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
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

        try {
          // Meminta izin push notification/local notification di OS
          const permStatus = await LocalNotifications.requestPermissions();
          console.log('Permission Notification:', permStatus.display);
        } catch (e) {
          console.error('Error requesting notification permission', e);
        }
      }
    });
  }
}
