import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { MutasiService } from '../../../services/mutasi.service';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';

@Component({
  selector: 'app-mutasi-pindah',
  templateUrl: './mutasi-pindah.page.html',
  styleUrls: ['./mutasi-pindah.page.scss'],
  standalone: false,
})
export class MutasiPindahPage implements OnInit {
  peternakList: any[] = [];
  populasiList: any[] = [];

  idHewan = '';
  kelompokHewan = '';
  jenisHewan = '';
  ras = '';
  umur = '';
  beratBadan = '';
  tanggalPindah = '';
  alamatAsal = '';
  latitudeAsal: number | null = null;
  longitudeAsal: number | null = null;
  alamatTujuan = '';
  latitudeTujuan: number | null = null;
  longitudeTujuan: number | null = null;
  deskripsi = '';
  peternakan_id = '';
  populasi_id = '';
  isSubmitting = false;

  constructor(
    private navCtrl: NavController,
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
    private mutasiService: MutasiService,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  loadDataMaster() {
    this.peternakService.getAll().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        this.peternakList = res.data || [];
      } else if (Array.isArray(res)) {
        this.peternakList = res;
      } else {
        this.peternakList = res?.data || [];
      }
    });
  }

  onPemilikChange(event: any) {
    const selectedId = event.detail.value;
    this.peternakan_id = selectedId ? String(selectedId) : '';
    this.resetHewanData();

    if (!selectedId) {
      return;
    }

    this.populasiService
      .getPopulasi({ peternakan_id: selectedId })
      .subscribe((res: any) => {
        if (res.success && res.data) {
          this.populasiList = res.data;
        } else if (Array.isArray(res)) {
          this.populasiList = res;
        } else {
          this.populasiList = res?.data || [];
        }
      });
  }

  onHewanChange(event: any) {
    const selectedId = event.detail.value;
    if (!selectedId) return;

    const hewan = this.populasiList.find((item) => item.id == selectedId);
    if (!hewan) return;

    this.populasi_id = String(hewan.id);
    this.idHewan = hewan.code || '';
    this.kelompokHewan = hewan.kategori || '';
    this.jenisHewan = hewan.jenis_hewan || '';
    this.ras = hewan.ras || hewan.jenis_hewan || '';
    this.umur = hewan.umur ? String(hewan.umur) : '';
    this.beratBadan = hewan.berat_badan ? String(hewan.berat_badan) : '';
  }

  async simpanData() {
    if (!this.populasi_id || !this.tanggalPindah) {
      await this.showToast('Mohon lengkapi semua data yang diperlukan.', 'warning');
      return;
    }

    const lokasiAsal = this.buildLokasiLabel(
      this.alamatAsal,
      this.latitudeAsal,
      this.longitudeAsal,
    );
    const lokasiTujuan = this.buildLokasiLabel(
      this.alamatTujuan,
      this.latitudeTujuan,
      this.longitudeTujuan,
    );

    if (!lokasiAsal) {
      await this.showToast('Mohon isi alamat atau koordinat asal.', 'warning');
      return;
    }

    if (!lokasiTujuan) {
      await this.showToast('Mohon isi alamat atau koordinat tujuan.', 'warning');
      return;
    }

    await this.submitMutasi(
      {
        populasi_id: Number(this.populasi_id),
        jenis_mutasi: 'pindah',
        tanggal: this.tanggalPindah,
        lokasi_asal: lokasiAsal,
        lokasi_tujuan: lokasiTujuan,
        deskripsi: this.deskripsi.trim() || null,
      },
      'Data mutasi pindah hewan berhasil disimpan.',
    );
  }

  getLokasiAsal() {
    this.getLokasi((latitude, longitude) => {
      this.latitudeAsal = latitude;
      this.longitudeAsal = longitude;
      this.showToast('Lokasi asal berhasil diambil.', 'success');
    });
  }

  getLokasiTujuan() {
    this.getLokasi((latitude, longitude) => {
      this.latitudeTujuan = latitude;
      this.longitudeTujuan = longitude;
      this.showToast('Lokasi tujuan berhasil diambil.', 'success');
    });
  }

  private getLokasi(callback: (latitude: number, longitude: number) => void) {
    if (!navigator.geolocation) {
      this.showToast('Browser tidak mendukung fitur lokasi.', 'danger');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Gagal mendapatkan lokasi:', error);
        this.showToast(
          'Tidak bisa mengambil lokasi. Pastikan GPS aktif dan izin diberikan.',
          'danger',
        );
      },
    );
  }

  private buildLokasiLabel(
    alamat: string,
    latitude: number | null,
    longitude: number | null,
  ): string | null {
    const parts = [alamat.trim()];

    if (latitude !== null && longitude !== null) {
      parts.push(`(${latitude}, ${longitude})`);
    }

    const label = parts.filter(Boolean).join(' ').trim();
    return label || null;
  }

  private resetHewanData() {
    this.populasiList = [];
    this.populasi_id = '';
    this.idHewan = '';
    this.kelompokHewan = '';
    this.jenisHewan = '';
    this.ras = '';
    this.umur = '';
    this.beratBadan = '';
    this.alamatAsal = '';
    this.alamatTujuan = '';
    this.latitudeAsal = null;
    this.longitudeAsal = null;
    this.latitudeTujuan = null;
    this.longitudeTujuan = null;
  }

  private async submitMutasi(payload: any, successMessage: string) {
    const loading = await this.loadingController.create({
      message: 'Menyimpan mutasi...',
    });

    await loading.present();
    this.isSubmitting = true;

    this.mutasiService.createMutasi(payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(successMessage, 'success');
        this.navCtrl.navigateBack('/petugas/mutasi');
      },
      error: async (err) => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(this.getErrorMessage(err), 'danger');
        console.error('Gagal menyimpan mutasi pindah:', err);
      },
    });
  }

  private getErrorMessage(err: any): string {
    if (err?.error?.errors) {
      return Object.values(err.error.errors)
        .flat()
        .map((value) => String(value))
        .join(' | ');
    }

    return err?.error?.message || 'Gagal menyimpan data mutasi';
  }

  async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'success',
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
