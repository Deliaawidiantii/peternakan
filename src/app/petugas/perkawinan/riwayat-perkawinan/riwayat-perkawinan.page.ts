import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { AuthService } from '../../../services/auth.service';

interface RiwayatPerkawinan {
  id: string;
  status: 'IB' | 'PKB' | 'Lahir';
  hasIB: boolean;
  hasPKB: boolean;
  hasLahir: boolean;
  eartagBetina: string;
  jenisTernak: string;
  rumpunTernak: string;
  usiaInduk?: number;
  tanggalIB?: string;
  metodePerkawinan: string;
  inseminasiKe?: number;
  kodeProduksi?: string;
  kodeBatch?: string;
  idPejantan?: string;
  tanggalPKB?: string;
  jenisPerkawinan?: 'IB' | 'Alami';
  umurKebuntingan?: number;
  prediksiLahir?: string;
  tanggalLahir?: string;
  namaPemilik: string;
  nikPemilik: string;
  telpPemilik: string;
  alamatPemilik: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  namaPetugas?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-riwayat-perkawinan',
  templateUrl: './riwayat-perkawinan.page.html',
  styleUrls: ['./riwayat-perkawinan.page.scss'],
  standalone: false,
})
export class RiwayatPerkawinanPage implements OnInit {
  riwayatList: RiwayatPerkawinan[] = [];
  filteredRiwayat: RiwayatPerkawinan[] = [];

  searchTerm: string = '';
  filterStatus: string = 'semua';
  currentPetugasName: string = '-';
  isLoading = false;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private perkawinanService: PerkawinanService,
    private authService: AuthService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const localUser = this.authService.getUser();
    this.currentPetugasName = localUser?.nama || localUser?.name || '-';
    this.loadRiwayatData();
  }

  ionViewWillEnter() {
    this.loadRiwayatData();
  }

  async loadRiwayatData() {
    this.isLoading = true;

    this.perkawinanService.index().subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        const data = Array.isArray(res?.data) ? res.data : [];
        this.riwayatList = data.map((item: any) => this.mapRiwayatItem(item));
        this.applyFilters();
      },
      error: async (err: any) => {
        this.isLoading = false;
        this.riwayatList = [];
        this.applyFilters();
        await this.showToast(err?.error?.message || 'Gagal memuat riwayat perkawinan', 'danger');
      },
    });
  }

  private mapRiwayatItem(item: any): RiwayatPerkawinan {
    const tambahan = item?.data_tambahan || {};
    const lokasi = tambahan?.lokasi || {};
    const statusBackend = String(item?.status || 'menunggu_pkb');

    const hasIB = true;
    const hasPKB = ['sudah_pkb', 'sudah_melahirkan', 'akta_terbit'].includes(statusBackend);
    const hasLahir = ['sudah_melahirkan', 'akta_terbit'].includes(statusBackend);

    const statusLabel: 'IB' | 'PKB' | 'Lahir' = hasLahir ? 'Lahir' : hasPKB ? 'PKB' : 'IB';

    const jenisRumpun = String(item?.jenis_rumpun || '');
    const [jenis, rumpun] = jenisRumpun.includes(' - ')
      ? jenisRumpun.split(' - ')
      : [item?.populasi?.jenis_hewan || '-', item?.populasi?.ras || jenisRumpun || '-'];

    return {
      id: String(item?.id || ''),
      status: statusLabel,
      hasIB,
      hasPKB,
      hasLahir,
      eartagBetina: item?.eartag || item?.populasi?.code || '-',
      jenisTernak: jenis || '-',
      rumpunTernak: rumpun || '-',
      usiaInduk: Number(tambahan?.usia_ternak || item?.populasi?.umur || 0) || undefined,
      tanggalIB: item?.tanggal_kawin || undefined,
      metodePerkawinan: item?.metode || '-',
      inseminasiKe: tambahan?.inseminasi_ke ? Number(tambahan.inseminasi_ke) : undefined,
      kodeProduksi: tambahan?.kode_produksi || undefined,
      kodeBatch: tambahan?.kode_batch || undefined,
      idPejantan: tambahan?.id_pejantan || undefined,
      tanggalPKB: item?.tanggal_pkb || undefined,
      jenisPerkawinan: item?.metode === 'Alami' ? 'Alami' : 'IB',
      umurKebuntingan: tambahan?.pkb?.umur_kebuntingan ? Number(tambahan.pkb.umur_kebuntingan) : undefined,
      prediksiLahir: tambahan?.pkb?.prediksi_lahir || undefined,
      tanggalLahir: item?.tanggal_kelahiran || undefined,
      namaPemilik: item?.peternakan?.nama_peternak || item?.pemilik || tambahan?.nama_pemilik || '-',
      nikPemilik: item?.peternakan?.nik || tambahan?.nik_pemilik || '-',
      telpPemilik: item?.peternakan?.no_telp || tambahan?.telp_pemilik || '-',
      alamatPemilik: item?.peternakan?.alamat || tambahan?.alamat || '-',
      provinsi: lokasi?.provinsi || '-',
      kabupaten: lokasi?.kabupaten || '-',
      kecamatan: lokasi?.kecamatan || '-',
      desa: lokasi?.desa || '-',
      namaPetugas: this.currentPetugasName || item?.petugas?.nama || '-',
      foto: tambahan?.foto || undefined,
      createdAt: item?.created_at || new Date().toISOString(),
      updatedAt: item?.updated_at || new Date().toISOString(),
    };
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.riwayatList];

    if (this.filterStatus !== 'semua') {
      filtered = filtered.filter((item) => {
        if (this.filterStatus === 'ib') return item.hasIB && !item.hasPKB;
        if (this.filterStatus === 'pkb') return item.hasPKB && !item.hasLahir;
        if (this.filterStatus === 'lahir') return item.hasLahir;
        return true;
      });
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.eartagBetina.toLowerCase().includes(term) ||
        item.namaPemilik.toLowerCase().includes(term) ||
        item.desa.toLowerCase().includes(term) ||
        item.kecamatan.toLowerCase().includes(term) ||
        item.rumpunTernak.toLowerCase().includes(term),
      );
    }

    this.filteredRiwayat = filtered;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'IB':
        return 'primary';
      case 'PKB':
        return 'warning';
      case 'Lahir':
        return 'success';
      default:
        return 'medium';
    }
  }

  async openDetail(item: RiwayatPerkawinan, event?: Event) {
    if (event) event.stopPropagation();

    this.router.navigate(['/petugas/perkawinan/detail-riwayat-perkawinan'], {
      queryParams: {
        eartagId: item.id,
        eartag: item.eartagBetina,
      },
    });
  }

  async viewPhoto(item: RiwayatPerkawinan, event: Event) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Foto',
      message: item.foto
        ? `Menampilkan foto untuk ${item.eartagBetina}<br><br><img src="${item.foto}" style="width: 100%; border-radius: 8px;">`
        : 'Foto belum tersedia.',
      cssClass: 'photo-alert',
      buttons: ['Tutup'],
    });

    await alert.present();
  }

  async updateProgress(item: RiwayatPerkawinan, event: Event) {
    event.stopPropagation();

    if (!item.hasPKB) {
      this.router.navigate(['petugas/perkawinan/input-pkb'], {
        queryParams: {
          eartagId: item.id,
          eartag: item.eartagBetina,
        },
      });
    } else if (!item.hasLahir) {
      this.router.navigate(['/petugas/perkawinan/lahir'], {
        queryParams: {
          eartagId: item.id,
          eartag: item.eartagBetina,
        },
      });
    }
  }

  async showFilterModal() {
    const alert = await this.alertCtrl.create({
      header: 'Filter Riwayat',
      inputs: [
        { type: 'radio', label: 'Semua Data', value: 'semua', checked: this.filterStatus === 'semua' },
        { type: 'radio', label: 'IB Saja', value: 'ib', checked: this.filterStatus === 'ib' },
        { type: 'radio', label: 'Sudah PKB', value: 'pkb', checked: this.filterStatus === 'pkb' },
        { type: 'radio', label: 'Sudah Lahir', value: 'lahir', checked: this.filterStatus === 'lahir' },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Terapkan',
          handler: (data) => {
            this.filterStatus = data;
            this.applyFilters();
          },
        },
      ],
    });

    await alert.present();
  }

  goToInputIB() {
    this.router.navigate(['/petugas/perkawinan/input-perkawinan']);
  }

  doRefresh(event: any) {
    this.loadRiwayatData().finally(() => {
      event.target.complete();
    });
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
