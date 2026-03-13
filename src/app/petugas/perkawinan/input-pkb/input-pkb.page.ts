import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-input-pkb',
  templateUrl: './input-pkb.page.html',
  styleUrls: ['./input-pkb.page.scss'],
  standalone: false,
})
export class InputPKBPage implements OnInit {
  @ViewChild('pkbForm') pkbForm!: NgForm;

  perkawinanId: number | null = null;
  currentDataTambahan: any = {};
  isSubmitting = false;

  formData = {
    namaPetugas: '',
    nikPetugas: '',
    telpPetugas: '',

    eartagBetina: '',
    jenisTernak: '',
    rumpunTernak: '',
    umurInduk: null as number | null,

    tanggalPKB: '',
    jenisPerkawinan: '',
    umurKebuntingan: null as number | null,
    prediksiLahir: '',

    namaPemilik: '',
    nikPemilik: '',

    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    desa: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private perkawinanService: PerkawinanService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.perkawinanId = Number(this.route.snapshot.queryParamMap.get('eartagId')) || null;
    this.loadLoggedInPetugas();

    if (this.perkawinanId) {
      this.loadRiwayatData(this.perkawinanId);
    } else {
      this.showToast('ID riwayat ternak tidak valid', 'danger');
    }
  }

  loadLoggedInPetugas() {
    const localUser = this.authService.getUser();
    this.formData.namaPetugas = localUser?.nama || localUser?.name || '-';
    this.formData.nikPetugas = localUser?.nik || '-';
    this.formData.telpPetugas = localUser?.no_telp || localUser?.phone || '-';

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        const user = res?.data || res?.user || null;
        if (!user) return;
        this.formData.namaPetugas = user?.nama || user?.name || this.formData.namaPetugas;
        this.formData.nikPetugas = user?.nik || this.formData.nikPetugas;
        this.formData.telpPetugas = user?.no_telp || user?.phone || this.formData.telpPetugas;
      },
      error: () => {
        // Fallback to local user values.
      },
    });
  }

  async loadRiwayatData(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Memuat data riwayat...' });
    await loading.present();

    this.perkawinanService.show(id).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        const data = res?.data || null;
        if (!data) {
          await this.showToast('Data riwayat tidak ditemukan', 'danger');
          return;
        }

        const tambahan = data?.data_tambahan || {};
        const lokasi = tambahan?.lokasi || {};
        this.currentDataTambahan = tambahan;

        const jenisRumpun = String(data?.jenis_rumpun || '');
        const [jenis, rumpun] = jenisRumpun.includes(' - ')
          ? jenisRumpun.split(' - ')
          : [data?.populasi?.jenis_hewan || '-', data?.populasi?.ras || jenisRumpun || '-'];

        this.formData.eartagBetina = data?.eartag || data?.populasi?.code || '';
        this.formData.jenisTernak = jenis || '';
        this.formData.rumpunTernak = rumpun || '';
        this.formData.umurInduk = Number(tambahan?.usia_ternak || data?.populasi?.umur || 0) || null;

        this.formData.tanggalPKB = data?.tanggal_pkb || '';
        this.formData.jenisPerkawinan = data?.metode || 'IB';
        this.formData.umurKebuntingan = tambahan?.pkb?.umur_kebuntingan
          ? Number(tambahan.pkb.umur_kebuntingan)
          : null;
        this.formData.prediksiLahir = tambahan?.pkb?.prediksi_lahir || '';

        this.formData.namaPemilik = data?.peternakan?.nama_peternak || tambahan?.nama_pemilik || '';
        this.formData.nikPemilik = data?.peternakan?.nik || tambahan?.nik_pemilik || '';

        this.formData.provinsi = lokasi?.provinsi || '';
        this.formData.kabupaten = lokasi?.kabupaten || '';
        this.formData.kecamatan = lokasi?.kecamatan || '';
        this.formData.desa = lokasi?.desa || '';
      },
      error: async (err: any) => {
        await loading.dismiss();
        await this.showToast(err?.error?.message || 'Gagal memuat data riwayat', 'danger');
      },
    });
  }

  hitungPrediksiLahir() {
    if (this.formData.tanggalPKB && this.formData.umurKebuntingan !== null) {
      const tanggalPKB = new Date(this.formData.tanggalPKB);
      const umurKebuntingan = Number(this.formData.umurKebuntingan || 0);
      const sisaBulan = 9 - umurKebuntingan;

      if (sisaBulan > 0) {
        const prediksiDate = new Date(tanggalPKB);
        prediksiDate.setMonth(prediksiDate.getMonth() + sisaBulan);

        const year = prediksiDate.getFullYear();
        const month = String(prediksiDate.getMonth() + 1).padStart(2, '0');
        const day = String(prediksiDate.getDate()).padStart(2, '0');

        this.formData.prediksiLahir = `${year}-${month}-${day}`;
      } else {
        this.formData.prediksiLahir = this.formData.tanggalPKB;
      }
    }
  }

  async submitForm() {
    if (!this.perkawinanId) {
      await this.showToast('ID riwayat ternak tidak ditemukan', 'danger');
      return;
    }

    if (!this.formData.tanggalPKB || !this.formData.jenisPerkawinan || this.formData.umurKebuntingan === null) {
      await this.showAlert('Peringatan', 'Mohon lengkapi data PKB terlebih dahulu.');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan data PKB...',
      spinner: 'crescent',
    });
    await loading.present();

    const mergedTambahan = {
      ...this.currentDataTambahan,
      nama_pemilik: this.formData.namaPemilik,
      nik_pemilik: this.formData.nikPemilik,
      lokasi: {
        provinsi: this.formData.provinsi,
        kabupaten: this.formData.kabupaten,
        kecamatan: this.formData.kecamatan,
        desa: this.formData.desa,
      },
      pkb: {
        tanggal_pkb: this.formData.tanggalPKB,
        jenis_perkawinan: this.formData.jenisPerkawinan,
        umur_kebuntingan: this.formData.umurKebuntingan,
        prediksi_lahir: this.formData.prediksiLahir,
      },
      petugas_input_pkb: {
        nama: this.formData.namaPetugas,
        nik: this.formData.nikPetugas,
        telp: this.formData.telpPetugas,
      },
    };

    const payload: any = {
      status: 'sudah_pkb',
      tanggal_pkb: this.formData.tanggalPKB,
      metode: this.formData.jenisPerkawinan === 'Alami' ? 'Alami' : 'IB',
      data_tambahan: mergedTambahan,
      catatan: `PKB oleh ${this.formData.namaPetugas} (${this.formData.nikPetugas})`,
    };

    this.perkawinanService.update(this.perkawinanId, payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showSuccessAlert();
        this.router.navigate(['/petugas/perkawinan/riwayat-perkawinan']);
      },
      error: async (err: any) => {
        await loading.dismiss();
        this.isSubmitting = false;
        const message = err?.error?.message || 'Gagal menyimpan data PKB';
        await this.showToast(message, 'danger');
      },
    });
  }

  async resetForm() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Reset',
      message: 'Apakah Anda yakin ingin mereset form PKB?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Ya, Reset',
          handler: () => {
            this.formData.tanggalPKB = '';
            this.formData.umurKebuntingan = null;
            this.formData.prediksiLahir = '';
            this.showToast('Form PKB berhasil direset', 'medium');
          },
        },
      ],
    });

    await alert.present();
  }

  private async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Data PKB berhasil disimpan.',
      buttons: ['OK'],
      cssClass: 'alert-success',
    });
    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert',
    });
    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
