import { Component, OnDestroy, OnInit } from '@angular/core';
import { KegiatanService } from '../../services/kegiatan.service';

@Component({
  selector: 'app-kegiatan',
  templateUrl: './kegiatan.page.html',
  styleUrls: ['./kegiatan.page.scss'],
  standalone: false,
})
export class KegiatanPage implements OnInit, OnDestroy {
  kegiatanBerjalan: any[] = [];
  isLoading = true;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private readonly AUTO_REFRESH_MS = 10000;

  constructor(private kegiatanService: KegiatanService) {}

  ngOnInit() {
    this.loadKegiatan();
  }

  ionViewWillEnter() {
    this.loadKegiatan();
    this.startAutoRefresh();
  }

  ionViewWillLeave() {
    this.stopAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadKegiatan() {
    this.isLoading = true;
    this.kegiatanService.getKegiatan().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.kegiatanBerjalan = data.filter(
          (k: any) =>
            k.status_aktual === 'sedang_berjalan' ||
            k.status_aktual === 'butuh_diselesaikan',
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  getIconName(jenis: string): string {
    if (!jenis) return 'calendar-outline';
    const j = jenis.toLowerCase();
    if (j.includes('vaksin')) return 'medkit-outline';
    if (j.includes('pakan') || j.includes('makan')) return 'nutrition-outline';
    if (j.includes('kesehatan') || j.includes('periksa'))
      return 'heart-outline';
    if (j.includes('bersih') || j.includes('rawat')) return 'broom-outline';
    return 'calendar-outline';
  }

  private startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => {
      this.loadKegiatan();
    }, this.AUTO_REFRESH_MS);
  }

  private stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
