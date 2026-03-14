import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
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
  umurInduk?: number;
  tanggalIB?: string;
  metodePerkawinan: string;
  inseminasiKe?: number;
  usiaInduk?: number;
  kodeProduksi?: string;
  kodeBatch?: string;
  idPejantan?: string;
  tanggalPKB?: string;
  jenisPerkawinan?: 'IB' | 'Alami';
  umurKebuntingan?: number;
  prediksiLahir?: string;
  tanggalLahir?: string;
  jenisKelaminAnak?: 'Jantan' | 'Betina';
  beratLahirAnak?: number;
  kondisiAnak?: string;
  namaPemilik: string;
  nikPemilik: string;
  telpPemilik: string;
  alamatPemilik: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  namaPetugas?: string;
  nikPetugas?: string;
  telpPetugas?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-detail-riwayat-perkawinan',
  templateUrl: './detail-riwayat-perkawinan.page.html',
  styleUrls: ['./detail-riwayat-perkawinan.page.scss'],
  standalone: false,
})
export class DetailRiwayatPerkawinanPage implements OnInit {
  riwayat: RiwayatPerkawinan | null = null;
  eartagId = '';
  eartag = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private perkawinanService: PerkawinanService,
    private authService: AuthService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.eartagId = params['eartagId'] || '';
      this.eartag = params['eartag'] || '';

      if (this.eartagId) {
        this.loadRiwayatDetail(this.eartagId);
      } else {
        this.isLoading = false;
      }
    });
  }

  private loadRiwayatDetail(id: string) {
    this.isLoading = true;

    this.perkawinanService.show(Number(id)).subscribe({
      next: (res: any) => {
        const data = res?.data || null;
        this.riwayat = data ? this.mapRiwayatItem(data) : null;
        this.isLoading = false;
      },
      error: async (err: any) => {
        this.riwayat = null;
        this.isLoading = false;
        await this.showToast(err?.error?.message || 'Gagal memuat detail riwayat', 'danger');
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
      umurInduk: tambahan?.usia_ternak ? Math.floor(Number(tambahan.usia_ternak) / 12) : undefined,
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
      jenisKelaminAnak: tambahan?.lahir?.jenis_kelamin_anak || undefined,
      beratLahirAnak: tambahan?.lahir?.berat_lahir_anak ? Number(tambahan.lahir.berat_lahir_anak) : undefined,
      kondisiAnak: tambahan?.lahir?.kondisi_anak || undefined,
      namaPemilik: item?.peternakan?.nama_peternak || tambahan?.nama_pemilik || '-',
      nikPemilik: item?.peternakan?.nik || tambahan?.nik_pemilik || '-',
      telpPemilik: item?.peternakan?.no_telp || tambahan?.telp_pemilik || '-',
      alamatPemilik: item?.peternakan?.alamat || tambahan?.alamat || '-',
      provinsi: lokasi?.provinsi || '-',
      kabupaten: lokasi?.kabupaten || '-',
      kecamatan: lokasi?.kecamatan || '-',
      desa: lokasi?.desa || '-',
      namaPetugas:
        tambahan?.petugas_input_pkb?.nama ||
        tambahan?.petugas_input_ib?.nama ||
        this.authService.getUser()?.nama ||
        '-',
      nikPetugas:
        tambahan?.petugas_input_pkb?.nik ||
        tambahan?.petugas_input_ib?.nik ||
        this.authService.getUser()?.nik ||
        '-',
      telpPetugas:
        tambahan?.petugas_input_pkb?.telp ||
        tambahan?.petugas_input_ib?.telp ||
        this.authService.getUser()?.no_telp ||
        '-',
      foto: tambahan?.foto || undefined,
      createdAt: item?.created_at || new Date().toISOString(),
      updatedAt: item?.updated_at || new Date().toISOString(),
    };
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

  updateProgress() {
    if (!this.riwayat) return;

    if (this.riwayat.hasPKB && !this.riwayat.hasLahir) {
      this.router.navigate(['/petugas/perkawinan/lahir'], {
        queryParams: {
          eartagId: this.riwayat.id,
          eartag: this.riwayat.eartagBetina,
        },
      });
      return;
    }

    if (this.riwayat.hasIB && !this.riwayat.hasPKB) {
      this.router.navigate(['/petugas/perkawinan/input-pkb'], {
        queryParams: {
          eartagId: this.riwayat.id,
          eartag: this.riwayat.eartagBetina,
        },
      });
    }
  }

  editRiwayat() {
    if (!this.eartagId) return;

    this.router.navigate(['/petugas/perkawinan/edit-riwayat'], {
      queryParams: {
        eartagId: this.eartagId,
        eartag: this.eartag,
      },
    });
  }

  goBack() {
    this.navController.back();
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
