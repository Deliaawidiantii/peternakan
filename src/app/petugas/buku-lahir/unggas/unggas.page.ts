import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PopulasiService } from '../../../services/populasi.service';

@Component({
  selector: 'app-unggas',
  templateUrl: './unggas.page.html',
  styleUrls: ['./unggas.page.scss'],
  standalone: false,
})
export class UnggasPage implements OnInit {
  form: any = this.createInitialForm();
  isSubmitting = false;

  constructor(
    private router: Router,
    private populasiService: PopulasiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {}

  private createInitialForm() {
    return {
      tanggal_penetasan: '',
      id_induk: '',
      jenis_unggas: '',
      ras: '',
      jumlah_telur: 0,
      jumlah_menetas: 0,
      jumlah_normal: 0,
      jumlah_cacat: 0,
      jumlah_mati: 0,
      total_menetas: 0,
      catatan: '',
    };
  }

  private parseCount(value: any): number {
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  }

  private getStatusBreakdown() {
    return [
      { status: 'normal', label: 'Normal', count: this.parseCount(this.form.jumlah_normal) },
      { status: 'cacat', label: 'Cacat', count: this.parseCount(this.form.jumlah_cacat) },
      { status: 'mati', label: 'Mati', count: this.parseCount(this.form.jumlah_mati) },
    ].filter((item) => item.count > 0);
  }

  calculateTotals() {
    this.form.total_menetas = this.getStatusBreakdown().reduce((total, item) => total + item.count, 0);
  }

  private async findIndukByCode() {
    const response = await firstValueFrom(
      this.populasiService.getPopulasi({
        code: this.form.id_induk,
        kategori: 'unggas',
        status: 'approved',
        sort: 'desc',
      }),
    );

    const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    const requestedCode = String(this.form.id_induk || '').trim().toLowerCase();

    return (
      list.find((item: any) => String(item?.code || '').trim().toLowerCase() === requestedCode) ||
      list[0] ||
      null
    );
  }

  private buildBatchItems(induk: any) {
    const items: any[] = [];
    let urutanAnak = 1;

    this.getStatusBreakdown().forEach((item) => {
      for (let index = 0; index < item.count; index += 1) {
        items.push({
          kategori: 'unggas',
          jenis_hewan: this.form.jenis_unggas,
          ras: this.form.ras || induk?.ras || null,
          jenis_kelamin: null,
          umur: 0,
          jumlah: 1,
          peternakan_id: induk?.peternakan_id || induk?.peternakan?.id || null,
          kandang_id: induk?.kandang_id || induk?.kandang?.id || null,
          wilayah_id: induk?.wilayah_id || induk?.wilayah?.id || induk?.peternakan?.wilayah_id || null,
          tanggal: this.form.tanggal_penetasan,
          status: item.status === 'mati' ? 'mati' : 'lahir',
          generate_qr: false,
          data_tambahan: {
            sumber: 'buku_lahir_unggas',
            id_induk: this.form.id_induk,
            status_anak: item.status,
            jumlah_telur: this.parseCount(this.form.jumlah_telur),
            jumlah_menetas: this.parseCount(this.form.jumlah_menetas),
            urutan_anak: urutanAnak,
            urutan_status: index + 1,
            catatan: this.form.catatan || null,
          },
        });

        urutanAnak += 1;
      }
    });

    return items;
  }

  private buildSuccessMessage(createdItems: any[]) {
    const grouped = createdItems.reduce((acc: any, item: any) => {
      const status = item?.data_tambahan?.status_anak || 'normal';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(item.code);
      return acc;
    }, {});

    const sections = [
      { key: 'normal', label: 'Normal' },
      { key: 'cacat', label: 'Cacat' },
      { key: 'mati', label: 'Mati' },
    ]
      .filter((section) => Array.isArray(grouped[section.key]) && grouped[section.key].length > 0)
      .map((section) => `${section.label} (${grouped[section.key].length}): ${grouped[section.key].join(', ')}`);

    return [
      'Data penetasan unggas berhasil disimpan.',
      'ID anak dibuat otomatis berdasarkan jumlah menetas.',
      '',
      ...sections,
    ].join('\n');
  }

  isFormValid(): boolean {
    const jumlahTelur = this.parseCount(this.form.jumlah_telur);
    const jumlahMenetas = this.parseCount(this.form.jumlah_menetas);
    const totalMenetas = this.getStatusBreakdown().reduce((total, item) => total + item.count, 0);

    return !!(
      this.form.tanggal_penetasan &&
      this.form.id_induk &&
      this.form.jenis_unggas &&
      jumlahTelur > 0 &&
      jumlahMenetas > 0 &&
      totalMenetas > 0 &&
      totalMenetas === jumlahMenetas &&
      jumlahMenetas <= jumlahTelur
    );
  }

  async submit() {
    if (!this.isFormValid()) {
      await this.showToast(
        'Mohon pastikan jumlah menetas tidak melebihi jumlah telur dan rincian status sama dengan jumlah menetas.',
        'danger',
      );
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan data penetasan unggas...' });
    await loading.present();

    try {
      const induk = await this.findIndukByCode();

      if (!induk) {
        throw new Error('ID induk tidak ditemukan atau belum approved.');
      }

      const response = await firstValueFrom(
        this.populasiService.createPopulasiBatch({ items: this.buildBatchItems(induk) }),
      );
      const createdItems = Array.isArray(response?.data) ? response.data : [];

      const alert = await this.alertCtrl.create({
        header: 'Berhasil',
        message: this.buildSuccessMessage(createdItems),
        buttons: ['OK'],
        cssClass: 'custom-alert',
      });
      await alert.present();
      await alert.onDidDismiss();

      this.form = this.createInitialForm();
      this.router.navigate(['/petugas/buku-lahir']);
    } catch (err: any) {
      const validationErrors = err?.error?.errors
        ? Object.values(err.error.errors).reduce((acc: string[], value: any) => acc.concat(value as string[]), [])
        : [];
      const message = validationErrors.length
        ? validationErrors.join(', ')
        : err?.error?.message || err?.message || 'Gagal menyimpan data penetasan unggas';
      await this.showToast(message, 'danger');
    } finally {
      await loading.dismiss();
      this.isSubmitting = false;
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2400,
      color,
    });
    await toast.present();
  }
}
