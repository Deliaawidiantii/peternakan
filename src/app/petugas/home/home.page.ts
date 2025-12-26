import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopulasiService } from 'src/app/services/populasi.service';
import { PeternakService } from 'src/app/services/peternak.service';
import { WilayahService } from 'src/app/services/wilayah.service';
import { KandangService } from 'src/app/services/kandang.service';
import { KegiatanService } from 'src/app/services/kegiatan.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  // Data Statistik (dari Database)
  stats = {
    totalTernak: 0,
    totalPemilik: 0,
    totalKandang: 0,
    totalKegiatan: 0
  };

  // Data Laporan Terbaru (dari Database)
  laporanTerbaru: any[] = [];

  // Info Lokasi
  lokasiInfo = {
    desa: 'Loading...',
    kecamatan: 'Loading...'
  };

  // Info User
  namaPetugas: string = '';
  wilayahIdUser: number | null = null;

  // Loading state
  isLoadingStats: boolean = false;
  isLoadingLaporan: boolean = false;
  isLoadingLokasi: boolean = false;

  constructor(
    private router: Router,
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
    private wilayahService: WilayahService,
    private kandangService: KandangService,
    private kegiatanService: KegiatanService
  ) {}

  ngOnInit() {
    // Ambil nama petugas dari localStorage
    this.loadUserInfo();
    
    // Load lokasi berdasarkan wilayah user
    this.loadLokasiInfo();
    
    // Load data dari database
    this.loadStatistik();
    this.loadLaporanTerbaru();
  }

  /**
 * Load informasi user dari localStorage
 */
loadUserInfo() {
  const user = localStorage.getItem('user');

  if (user) {
    try {
      const userData = JSON.parse(user);

      this.namaPetugas = userData.nama || userData.username || 'Petugas';

      console.log("🔍 Data User:", userData);

      // Simpan ID wilayah user → pastikan angka
      this.wilayahIdUser = Number(userData.desa_binaan) || null;

      console.log("📍 ID Desa Binaan User (Number):", this.wilayahIdUser);

    } catch (e) {
      console.error("❌ Error parse user:", e);
      this.namaPetugas = "Petugas";
    }
  }
}


loadLokasiInfo() {
  this.isLoadingLokasi = true;

  this.wilayahService.getPublicWilayah().subscribe({
    next: (res: any) => {
      console.log("RAW wilayah:", res);

      // Normalisasi response agar selalu array
      let wilayahList: any[] = [];

      if (Array.isArray(res)) {
        wilayahList = res;
      } else if (res?.data) {
        wilayahList = res.data;
      } else {
        wilayahList = [];
      }

      console.log("🗺️ Wilayah list final:", wilayahList);
      console.log("🎯 wilayahIdUser:", this.wilayahIdUser);

      // Cek apakah ID user valid
      const idUser = Number(this.wilayahIdUser);
      const validId = !isNaN(idUser) && idUser > 0;

      // Jika user belum punya wilayah
      if (!validId) {
        console.log("⚠️ User belum punya wilayah");
        if (wilayahList.length > 0) {
          this.lokasiInfo = {
            desa: wilayahList[0].nama_desa,
            kecamatan: wilayahList[0].nama_kecamatan,
          };
        } else {
          this.lokasiInfo = { desa: "Tidak ditemukan", kecamatan: "-" };
        }
        this.isLoadingLokasi = false;
        return;
      }

      // Cari wilayah sesuai ID user
      const wilayahUser = wilayahList.find(
        (w) => Number(w.id) === idUser
      );

      if (wilayahUser) {
        console.log("✅ Wilayah ditemukan:", wilayahUser);
        this.lokasiInfo = {
          desa: wilayahUser.nama_desa,
          kecamatan: wilayahUser.nama_kecamatan,
        };
      } else {
        console.log("⚠️ Wilayah tidak ditemukan, fallback default");
        if (wilayahList.length > 0) {
          this.lokasiInfo = {
            desa: wilayahList[0].nama_desa,
            kecamatan: wilayahList[0].nama_kecamatan,
          };
        } else {
          this.lokasiInfo = { desa: "Tidak ditemukan", kecamatan: "-" };
        }
      }

      this.isLoadingLokasi = false;
    },

    error: (err) => {
      console.error("❌ Error wilayah:", err);
      this.lokasiInfo = { desa: "Error", kecamatan: "-" };
      this.isLoadingLokasi = false;
    },
  });
}

  /**
   * Load data statistik dari database
   */
  loadStatistik() {
    this.isLoadingStats = true;

    // 1. Load Total Ternak
    this.populasiService.getPopulasi().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.stats.totalTernak = response.data.length;
        } else if (Array.isArray(response)) {
          this.stats.totalTernak = response.length;
        }
        console.log('✅ Total Ternak:', this.stats.totalTernak);
      },
      error: (err) => {
        console.error('❌ Error loading ternak:', err);
      }
    });

    // 2. Load Total Pemilik/Peternak
    this.peternakService.getAll().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.stats.totalPemilik = response.data.length;
        } else if (Array.isArray(response)) {
          this.stats.totalPemilik = response.length;
        }
        console.log('✅ Total Pemilik:', this.stats.totalPemilik);
      },
      error: (err) => {
        console.error('❌ Error loading pemilik:', err);
      }
    });

    // 3. Total Kandang (dari database)
    this.kandangService.getKandangList().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.stats.totalKandang = response.data.length;
        } else if (Array.isArray(response)) {
          this.stats.totalKandang = response.length;
        }
        console.log('✅ Total Kandang:', this.stats.totalKandang);
      },
      error: (err) => {
        console.error('❌ Error loading kandang:', err);
        this.stats.totalKandang = 0;
      }
    });

    // 4. Total Kegiatan (dummy dulu, sesuaikan dengan service kegiatan kalau ada)
     this.kegiatanService.getKegiatan().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.stats.totalKegiatan = response.data.length;
        } else if (Array.isArray(response)) {
          this.stats.totalKegiatan = response.length;
        }
        console.log('✅ Total kegiatan:', this.stats.totalKegiatan);
      },
      error: (err) => {
        console.error('❌ Error loading kegiatan:', err);
        this.stats.totalKegiatan = 0;
      }
    }); // Ganti dengan API call jika ada

    this.isLoadingStats = false;
  }

  /**
   * Load laporan terbaru dari database (5 data terakhir)
   */
  loadLaporanTerbaru() {
    this.isLoadingLaporan = true;

    this.populasiService.getPopulasi().subscribe({
      next: (response: any) => {
        let data = [];
        
        if (response.success && response.data) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        }

        // Ambil 3 data terbaru dan format untuk tampilan
        this.laporanTerbaru = data
          .sort((a: any, b: any) => {
            const dateA = new Date(a.tanggal || a.created_at).getTime();
            const dateB = new Date(b.tanggal || b.created_at).getTime();
            return dateB - dateA; // Urutkan descending (terbaru dulu)
          })
          .slice(0, 3) // Ambil 3 data terakhir
          .map((item: any) => {
            return {
              icon: this.getIconByKategori(item.kategori),
              iconColor: this.getColorByKategori(item.kategori),
              title: `${this.capitalizeFirst(item.jenis_hewan)} - ${item.code || 'N/A'}`,
              subtitle: item.kandang_id ? `Kandang ${item.kandang_id}` : 'Belum ada kandang',
              note: this.formatTanggal(item.tanggal || item.created_at),
              status: this.getStatusLabel(item.status),
              statusClass: this.getStatusClass(item.status)
            };
          });

        console.log('✅ Laporan Terbaru:', this.laporanTerbaru);
        this.isLoadingLaporan = false;
      },
      error: (err) => {
        console.error('❌ Error loading laporan:', err);
        this.isLoadingLaporan = false;
        // Kosongkan array, biar tampil "Belum ada laporan"
        this.laporanTerbaru = [];
      }
    });
  }

  /**
   * Helper: Get icon berdasarkan kategori
   */
  getIconByKategori(kategori: string): string {
    const iconMap: any = {
      'ruminansia': 'paw-outline',
      'unggas': 'egg-outline',
      'kesayangan': 'heart-outline',
      'primata': 'paw-outline',
      'lainnya': 'paw-outline'
    };
    return iconMap[kategori] || 'paw-outline';
  }

  /**
   * Helper: Get color berdasarkan kategori
   */
  getColorByKategori(kategori: string): string {
    const colorMap: any = {
      'ruminansia': '#ff6b6b',
      'unggas': '#fdcb6e',
      'kesayangan': '#ff6b6b',
      'primata': '#4ecdc4',
      'lainnya': '#a29bfe'
    };
    return colorMap[kategori] || '#ff6b6b';
  }

  /**
   * Helper: Get status label
   */
  getStatusLabel(status: string): string {
    const statusMap: any = {
      'masuk': 'Masuk',
      'lahir': 'Lahir',
      'mati': 'Mati',
      'dijual': 'Dijual',
      'dipotong': 'Dipotong'
    };
    return statusMap[status] || status;
  }

  /**
   * Helper: Get status class untuk styling
   */
  getStatusClass(status: string): string {
    const classMap: any = {
      'masuk': 'status',
      'lahir': 'status',
      'mati': 'status-alert',
      'dijual': 'status',
      'dipotong': 'status-alert'
    };
    return classMap[status] || 'status';
  }

  /**
   * Helper: Format tanggal
   */
  formatTanggal(tanggal: string): string {
    if (!tanggal) return 'N/A';
    
    const date = new Date(tanggal);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset jam untuk perbandingan tanggal saja
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Hari ini';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Kemarin';
    } else {
      // Format: 10 Des 2024
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('id-ID', options);
    }
  }

  /**
   * Helper: Capitalize first letter
   */
  capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // Method untuk navigasi ke halaman detail
  navigateToHewan() {
    this.router.navigate(['/petugas/hewan']);
  }

  navigateToPemilik() {
    this.router.navigate(['/petugas/pemilik']);
  }

  navigateToKandang() {
    this.router.navigate(['/petugas/kandang']);
  }

  navigateToKegiatan() {
    this.router.navigate(['/petugas/kegiatan']);
  }
}