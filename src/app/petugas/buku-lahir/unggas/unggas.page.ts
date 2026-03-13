import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { PopulasiService } from '../../../services/populasi.service';

@Component({
  selector: 'app-unggas',
  templateUrl: './unggas.page.html',
  styleUrls: ['./unggas.page.scss'],
  standalone: false,
})
export class UnggasPage implements OnInit {
  form: any = {
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

  generatedIds: any[] = [];
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private populasiService: PopulasiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {}

  calculateTotals() {
    // Calculate total menetas
    this.form.total_menetas = (this.form.jumlah_normal || 0) + (this.form.jumlah_cacat || 0) + (this.form.jumlah_mati || 0);

    // Validate: total breakdown should not exceed jumlah_menetas
    if (this.form.total_menetas > (this.form.jumlah_menetas || 0)) {
      this.form.total_menetas = this.form.jumlah_menetas || 0;
    }

    // Generate IDs for each status type
    this.generateIds();
  }

  generateIds() {
    this.generatedIds = [];

    if (!this.form.jenis_unggas || !this.form.tanggal_penetasan) {
      return;
    }

    const jenisPrefixes: { [key: string]: string } = {
      ayam: 'AYM',
      bebek: 'BBK',
      angsa: 'ANG',
    };

    const jenis = jenisPrefixes[this.form.jenis_unggas] || 'UNG';

    // Format tanggal: 20260314
    const tanggalObj = new Date(this.form.tanggal_penetasan);
    const tanggalStr = tanggalObj.toISOString().slice(0, 10).replace(/-/g, '');

    // Generate IDs for each status type
    const statusTypes = [
      { status: 'normal', label: 'Normal (Sehat)', count: this.form.jumlah_normal || 0 },
      { status: 'cacat', label: 'Cacat', count: this.form.jumlah_cacat || 0 },
      { status: 'mati', label: 'Mati', count: this.form.jumlah_mati || 0 },
    ];

    const statusPrefixes: { [key: string]: string } = {
      normal: 'NOR',
      cacat: 'CAC',
      mati: 'MAT',
    };

    statusTypes.forEach((type) => {
      if (type.count > 0) {
        const statusPrefix = statusPrefixes[type.status] || 'UNK';
        const ids = Array.from({ length: Number(type.count) }, (_, idx) =>
          `${jenis}-${statusPrefix}-${tanggalStr}-${String(idx + 1).padStart(3, '0')}`
        );

        this.generatedIds.push({
          status: type.status,
          label: type.label,
          count: type.count,
          idPattern: `${jenis}-${statusPrefix}-${tanggalStr}-XXX`,
          ids,
        });
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.form.tanggal_penetasan &&
      this.form.id_induk &&
      this.form.jenis_unggas &&
      this.form.jumlah_telur > 0 &&
      this.form.jumlah_menetas > 0 &&
      this.form.total_menetas > 0 &&
      this.form.total_menetas === (this.form.jumlah_normal + this.form.jumlah_cacat + this.form.jumlah_mati)
    );
  }

  async submit() {
    // Validate
    if (!this.isFormValid()) {
      await this.showToast(
        'Mohon lengkapi semua field dan pastikan total breakdown sama dengan jumlah menetas',
        'danger',
      );
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan data penetasan unggas...' });
    await loading.present();

    const payload: any = {
      kategori: 'unggas',
      jenis_hewan: this.form.jenis_unggas,
      ras: this.form.ras || null,
      jenis_kelamin: 'betina',
      umur: 0,
      jumlah: Number(this.form.jumlah_menetas || 0),
      status: 'masuk',
    };

    this.populasiService.createPopulasi(payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;

        const alert = await this.alertCtrl.create({
          header: 'Berhasil',
          message:
            `Data penetasan unggas berhasil disimpan.\n\n` +
            `Total menetas: ${this.form.jumlah_menetas}\n` +
            `Normal: ${this.form.jumlah_normal}, Cacat: ${this.form.jumlah_cacat}, Mati: ${this.form.jumlah_mati}`,
          buttons: ['OK'],
          cssClass: 'custom-alert',
        });
        await alert.present();
        await alert.onDidDismiss();

        // Reset form
        this.form = {
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
        this.generatedIds = [];

        // Navigate back
        this.router.navigate(['/petugas/buku-lahir']);
      },
      error: async (err) => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(err?.error?.message || 'Gagal menyimpan data penetasan unggas', 'danger');
      },
    });
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
