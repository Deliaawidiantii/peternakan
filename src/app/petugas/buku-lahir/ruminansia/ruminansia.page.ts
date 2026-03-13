import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { PopulasiService } from '../../../services/populasi.service';

@Component({
  selector: 'app-ruminansia',
  templateUrl: './ruminansia.page.html',
  styleUrls: ['./ruminansia.page.scss'],
  standalone: false,
})
export class RuminansiaPage implements OnInit {
  form: any = {
    tanggal_lahir: '',
    id_induk: '',
    jenis_ruminansia: '',
    ras: '',
    jenis_kelamin_anak: '',
    berat_lahir: '',
    status_kelahiran: 'normal',
    id_anak_hewan: '',
    catatan: '',
  };

  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private populasiService: PopulasiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {}

  // Auto-generate ID when key fields change
  ionViewWillLeave() {
    this.generateIdAnak();
  }

  generateIdAnak() {
    // Generate ID based on pattern: JENIS-STATUS-TANGGAL-RANDOM
    // Example: SAP-NOR-20260314-001
    if (!this.form.jenis_ruminansia || !this.form.status_kelahiran || !this.form.tanggal_lahir) {
      this.form.id_anak_hewan = '';
      return;
    }

    const jenisPrefixes: { [key: string]: string } = {
      sapi: 'SAP',
      kambing: 'KMG',
      domba: 'DOM',
    };

    const statusPrefixes: { [key: string]: string } = {
      normal: 'NOR',
      cacat: 'CAC',
      mati: 'MAT',
    };

    const jenis = jenisPrefixes[this.form.jenis_ruminansia] || 'UNK';
    const status = statusPrefixes[this.form.status_kelahiran] || 'UNK';

    // Format tanggal: 20260314
    const tanggalObj = new Date(this.form.tanggal_lahir);
    const tanggalStr = tanggalObj.toISOString().slice(0, 10).replace(/-/g, '');

    // Random suffix
    const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    this.form.id_anak_hewan = `${jenis}-${status}-${tanggalStr}-${randomSuffix}`;
  }

  async submit() {
    // Validate required fields
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

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan data kelahiran...' });
    await loading.present();

    this.generateIdAnak();

    // Simpan sebagai data populasi baru dengan metadata kelahiran di catatan
    const payload: any = {
      kategori: 'ruminansia',
      jenis_hewan: this.form.jenis_ruminansia,
      ras: this.form.ras || null,
      jenis_kelamin: this.form.jenis_kelamin_anak,
      umur: 0,
      berat_badan: this.form.berat_lahir ? Number(this.form.berat_lahir) : null,
      jumlah: 1,
      status: 'masuk',
    };

    this.populasiService.createPopulasi(payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;

        const alert = await this.alertCtrl.create({
          header: 'Berhasil',
          message: 'Data kelahiran ruminansia berhasil disimpan. ID Anak: ' + this.form.id_anak_hewan,
          buttons: ['OK'],
          cssClass: 'custom-alert',
        });
        await alert.present();
        await alert.onDidDismiss();

        // Reset form
        this.form = {
          tanggal_lahir: '',
          id_induk: '',
          jenis_ruminansia: '',
          ras: '',
          jenis_kelamin_anak: '',
          berat_lahir: '',
          status_kelahiran: 'normal',
          id_anak_hewan: '',
          catatan: '',
        };

        // Navigate back
        this.router.navigate(['/petugas/buku-lahir']);
      },
      error: async (err) => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(err?.error?.message || 'Gagal menyimpan data kelahiran', 'danger');
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
