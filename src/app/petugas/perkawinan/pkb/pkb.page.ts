import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';

interface HewanData {
  id: string;
  eartag: string;
  jenis: 'sapi' | 'kerbau' | 'kambing';
  rumpun: string;
  usia: number;
  pemilik: string;
  status: 'siap' | 'belum siap' | 'dalam proses';
}

@Component({
  selector: 'app-pkb',
  templateUrl: './pkb.page.html',
  styleUrls: ['./pkb.page.scss'],
  standalone: false,
})
export class PKBPage implements OnInit {
  searchTerm = '';
  selectedFilter = 'all';
  hewanList: HewanData[] = [];

  constructor(
    private router: Router,
    private perkawinanService: PerkawinanService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadHewan();
  }

  ionViewWillEnter() {
    this.loadHewan();
  }

  get filteredHewan(): HewanData[] {
    let filtered = [...this.hewanList];

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter((h) => h.jenis.toLowerCase() === this.selectedFilter.toLowerCase());
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.id.toLowerCase().includes(term) ||
          h.eartag.toLowerCase().includes(term) ||
          h.pemilik.toLowerCase().includes(term),
      );
    }

    return filtered;
  }

  loadHewan() {
    this.perkawinanService.index({ sort: 'desc' }).subscribe({
      next: (res: any) => {
        const rows = Array.isArray(res?.data) ? res.data : [];
        this.hewanList = rows.map((item: any) => this.mapToHewan(item));
      },
      error: async (err: any) => {
        this.hewanList = [];
        await this.showToast(err?.error?.message || 'Gagal memuat daftar hewan PKB', 'danger');
      },
    });
  }

  private mapToHewan(item: any): HewanData {
    const status = String(item?.status || 'menunggu_pkb');
    const statusMapped: 'siap' | 'belum siap' | 'dalam proses' =
      status === 'menunggu_pkb'
        ? 'siap'
        : status === 'sudah_pkb'
          ? 'dalam proses'
          : 'belum siap';

    const jenisRaw = String(item?.populasi?.jenis_hewan || item?.jenis_rumpun || 'sapi').toLowerCase();
    const jenis: 'sapi' | 'kerbau' | 'kambing' = jenisRaw.includes('kerbau')
      ? 'kerbau'
      : jenisRaw.includes('kambing')
        ? 'kambing'
        : 'sapi';

    const rumpun = String(item?.populasi?.ras || item?.jenis_rumpun || '-');
    const umur = Number(item?.populasi?.umur || item?.data_tambahan?.usia_ternak || 0) || 0;

    return {
      id: String(item?.id || ''),
      eartag: item?.eartag || item?.populasi?.code || '-',
      jenis,
      rumpun,
      usia: umur,
      pemilik: item?.peternakan?.nama_peternak || item?.pemilik || '-',
      status: statusMapped,
    };
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  filterHewan() {
    // filtering handled in getter
  }

  getJenisIcon(jenis: string): string {
    const value = (jenis || '').toLowerCase();
    if (value.includes('kambing')) return 'logo-octocat';
    if (value.includes('kerbau')) return 'fish-outline';
    return 'paw-outline';
  }

  getJenisColor(jenis: string): string {
    const value = (jenis || '').toLowerCase();
    if (value.includes('kambing')) return 'orange';
    if (value.includes('kerbau')) return 'teal';
    return 'blue';
  }

  getStatusClass(status: string): string {
    const value = (status || '').toLowerCase();
    if (value === 'siap') return 'approved';
    if (value === 'dalam proses') return 'pending';
    return 'rejected';
  }

  getStatusLabel(status: string): string {
    const value = (status || '').toLowerCase();
    if (value === 'siap') return 'Siap';
    if (value === 'dalam proses') return 'Dalam Proses';
    return 'Belum Siap';
  }

  lihatDetail(hewan: HewanData) {
    this.router.navigate(['/petugas/perkawinan/detail-riwayat-perkawinan'], {
      queryParams: { eartagId: hewan.id, eartag: hewan.eartag },
    });
  }

  async lakukanPKB(hewan: HewanData) {
    if (hewan.status !== 'siap') {
      await this.showToast('Hewan belum siap untuk proses PKB.', 'warning');
      return;
    }

    this.router.navigate(['/petugas/perkawinan/input-pkb'], {
      queryParams: { eartagId: hewan.id, eartag: hewan.eartag },
    });
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' = 'primary',
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });

    await toast.present();
  }
}
