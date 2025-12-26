import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KegiatanService } from '../../../services/kegiatan.service';

@Component({
  selector: 'app-jadwal-kegiatan',
  templateUrl: './jadwal-kegiatan.page.html',
  styleUrls: ['./jadwal-kegiatan.page.scss'],
  standalone: false,
})
export class JadwalKegiatanPage implements OnInit {

  selectedTab: string = 'semua';

  allKegiatan: any[] = [];     // 🔥 semua data dari API
  kegiatanList: any[] = [];    // 🔥 data yang sudah difilter

  loading = false;

  constructor(
    private kegiatanService: KegiatanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadKegiatan();
  }

  ionViewWillEnter() {
    this.loadKegiatan();
  }

  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
    this.applyFilter(); // 🔥 TIDAK HIT API LAGI
  }

  /**
   * Ambil data SEKALI dari API
   */
  loadKegiatan() {
    this.loading = true;

    this.kegiatanService.getKegiatan().subscribe({
      next: (res) => {
        this.allKegiatan = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Gagal ambil kegiatan', err);
        this.allKegiatan = [];
        this.kegiatanList = [];
        this.loading = false;
      }
    });
  }

  /**
   * 🔥 FILTER ALA SHOPEE
   */
  applyFilter() {
    if (this.selectedTab === 'semua') {
      this.kegiatanList = this.allKegiatan;
      return;
    }

    if (this.selectedTab === 'akan_datang') {
      this.kegiatanList = this.allKegiatan.filter(k =>
        k.status_aktual === 'terjadwal' ||
        k.status_aktual === 'terlambat'
      );
      return;
    }

    if (this.selectedTab === 'berjalan') {
      this.kegiatanList = this.allKegiatan.filter(k =>
        k.status_aktual === 'sedang_berjalan' ||
        k.status_aktual === 'butuh_diselesaikan'
      );
      return;
    }

    if (this.selectedTab === 'selesai') {
      this.kegiatanList = this.allKegiatan.filter(k =>
        k.status_aktual === 'selesai'
      );
      return;
    }

    this.kegiatanList = this.allKegiatan;
  }

  /**
   * Label status buat UI
   */
  getStatusLabel(kegiatan: any): string {
    switch (kegiatan.status_aktual) {
      case 'terjadwal':
        return 'Akan Datang';
      case 'terlambat':
        return 'Terlambat';
      case 'sedang_berjalan':
        return 'Sedang Berjalan';
      case 'butuh_diselesaikan':
        return 'Perlu Diselesaikan';
      case 'selesai':
        return 'Selesai';
      default:
        return kegiatan.status;
    }
  }

  goToDetail(id: number) {
    this.router.navigate(['/petugas/detail-kegiatan', id]);
  }
}
