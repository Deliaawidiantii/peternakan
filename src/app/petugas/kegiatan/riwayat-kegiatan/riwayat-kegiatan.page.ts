import { Component, OnInit } from '@angular/core';
import { KegiatanService } from '../../../services/kegiatan.service';

@Component({
  selector: 'app-riwayat-kegiatan',
  templateUrl: './riwayat-kegiatan.page.html',
  styleUrls: ['./riwayat-kegiatan.page.scss'],
  standalone: false,
})
export class RiwayatKegiatanPage implements OnInit {
  allRiwayat: any[] = [];
  riwayatList: any[] = [];
  isLoading = true;

  searchQuery = '';
  selectedStatus = 'Semua';

  constructor(private kegiatanService: KegiatanService) {}

  ngOnInit() {
    this.loadRiwayat();
  }

  ionViewWillEnter() {
    this.loadRiwayat();
  }

  loadRiwayat() {
    this.isLoading = true;
    this.kegiatanService.getKegiatan().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        // Hanya ambil yang selesai atau dibatalkan
        this.allRiwayat = data.filter(
          (k: any) =>
            k.status_aktual === 'selesai' ||
            k.status_aktual === 'dibatalkan' ||
            k.status === 'selesai' ||
            k.status === 'dibatalkan',
        );
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat riwayat kegiatan:', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter() {
    let filtered = this.allRiwayat;

    // Filter Search
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (k) =>
          (k.jenis && k.jenis.toLowerCase().includes(q)) ||
          (k.deskripsi && k.deskripsi.toLowerCase().includes(q)),
      );
    }

    // Filter Status
    if (this.selectedStatus && this.selectedStatus !== 'Semua') {
      const statusTarget = this.selectedStatus.toLowerCase(); // 'selesai' ou 'dibatalkan'
      filtered = filtered.filter((k) => {
        const s = k.status_aktual || k.status;
        return s === statusTarget;
      });
    }

    this.riwayatList = filtered;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
    this.applyFilter();
  }

  onFilterChange() {
    this.applyFilter();
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
}
