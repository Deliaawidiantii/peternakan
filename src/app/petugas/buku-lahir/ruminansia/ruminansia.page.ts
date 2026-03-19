import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PopulasiService } from '../../../services/populasi.service';

@Component({
  selector: 'app-ruminansia',
  templateUrl: './ruminansia.page.html',
  styleUrls: ['./ruminansia.page.scss'],
  standalone: false,
})
export class RuminansiaPage implements OnInit {
  form: any = this.createInitialForm();
  isSubmitting = false;
  isLoadingInduk = false;

  // Data for dropdowns
  indukList: any[] = [];
  filteredIndukList: any[] = [];
  selectedInduk: any = null;

  constructor(
    private router: Router,
    private populasiService: PopulasiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    this.loadIndukList();
  }

  private createInitialForm() {
    return {
      tanggal_lahir: '',
      id_induk: '',
      jenis_ruminansia: '',
      ras: '',
      jenis_kelamin_anak: '',
      berat_lahir: '',
      status_kelahiran: 'normal',
      catatan: '',
    };
  }

  /**
   * Load all female (betina) ruminansia animals as potential parents
   */
  loadIndukList() {
    this.isLoadingInduk = true;
    this.populasiService.getPopulasi({
      kategori: 'ruminansia',
      status: 'approved',
      sort: 'desc',
    }).subscribe({
      next: (res: any) => {
        const rawData = res?.data || [];
        // Filter only Betina as induk candidates and exclude dead ones
        this.indukList = rawData.filter((item: any) => {
          const kelamin = String(item?.jenis_kelamin || '').toLowerCase();
          const status = String(item?.status || '').toLowerCase();
          return kelamin === 'betina' && status !== 'mati';
        });
        this.filteredIndukList = [...this.indukList];
        this.isLoadingInduk = false;
      },
      error: () => {
        this.isLoadingInduk = false;
        this.indukList = [];
        this.filteredIndukList = [];
      }
    });
  }

  /**
   * When user selects an induk, auto-fill related fields
   */
  onIndukSelected(event: any) {
    const selectedCode = event?.detail?.value;
    if (!selectedCode) return;

    this.selectedInduk = this.indukList.find(
      (item: any) => item.code === selectedCode
    );

    if (this.selectedInduk) {
      // Auto-fill jenis and ras from the selected parent
      if (this.selectedInduk.jenis_hewan) {
        this.form.jenis_ruminansia = this.selectedInduk.jenis_hewan;
      }
      if (this.selectedInduk.ras) {
        this.form.ras = this.selectedInduk.ras;
      }
    }
  }

  getIndukLabel(item: any): string {
    const code = item?.code || '-';
    const jenis = item?.jenis_hewan || '';
    const pemilik = item?.peternakan?.nama_peternak || '';
    return `${code} - ${jenis} (${pemilik})`;
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private buildPayload() {
    const induk = this.selectedInduk;
    return {
      kategori: 'ruminansia',
      jenis_hewan: this.form.jenis_ruminansia,
      ras: this.form.ras || induk?.ras || null,
      jenis_kelamin: this.form.jenis_kelamin_anak,
      umur: 0,
      berat_badan: this.parseNumber(this.form.berat_lahir),
      jumlah: 1,
      peternakan_id: induk?.peternakan_id || induk?.peternakan?.id || null,
      kandang_id: induk?.kandang_id || induk?.kandang?.id || null,
      wilayah_id: induk?.wilayah_id || induk?.wilayah?.id || induk?.peternakan?.wilayah_id || null,
      tanggal: this.form.tanggal_lahir,
      status: this.form.status_kelahiran === 'mati' ? 'mati' : 'lahir',
      data_tambahan: {
        sumber: 'buku_lahir_ruminansia',
        id_induk: this.form.id_induk,
        status_anak: this.form.status_kelahiran,
        catatan: this.form.catatan || null,
      },
    };
  }

  async submit() {
    if (
      !this.form.tanggal_lahir ||
      !this.form.id_induk ||
      !this.form.jenis_ruminansia ||
      !this.form.jenis_kelamin_anak ||
      !this.form.status_kelahiran
    ) {
      await this.showToast('Mohon lengkapi semua field yang wajib diisi', 'danger');
      return;
    }

    if (!this.selectedInduk) {
      await this.showToast('ID Induk tidak valid. Pilih induk dari daftar.', 'danger');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan data kelahiran...' });
    await loading.present();

    try {
      const response = await firstValueFrom(
        this.populasiService.createPopulasi(this.buildPayload())
      );
      const createdId = response?.data?.code || '-';

      const alert = await this.alertCtrl.create({
        header: 'Berhasil',
        message: `Data kelahiran ruminansia berhasil disimpan. ID Anak: ${createdId}`,
        buttons: ['OK'],
        cssClass: 'custom-alert',
      });
      await alert.present();
      await alert.onDidDismiss();

      this.form = this.createInitialForm();
      this.selectedInduk = null;
      this.router.navigate(['/petugas/buku-lahir']);
    } catch (err: any) {
      const validationErrors = err?.error?.errors
        ? Object.values(err.error.errors).reduce((acc: string[], value: any) => acc.concat(value as string[]), [])
        : [];
      const message = validationErrors.length
        ? validationErrors.join(', ')
        : err?.error?.message || err?.message || 'Gagal menyimpan data kelahiran';
      await this.showToast(message, 'danger');
    } finally {
      await loading.dismiss();
      this.isSubmitting = false;
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
    });
    await toast.present();
  }
}
