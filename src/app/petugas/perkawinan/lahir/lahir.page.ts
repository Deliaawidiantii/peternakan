import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { PopulasiService } from '../../../services/populasi.service';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { SharedUiModule } from '../../../shared/shared-ui.module';

interface HewanInduk {
  id: string;
  eartagBetina: string;
  jenisTernak: string;
  rumpunTernak: string;
}

@Component({
  selector: 'app-lahir',
  templateUrl: './lahir.page.html',
  styleUrls: ['./lahir.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, SharedUiModule],
})
export class LahirPage implements OnInit {
  lahirForm: FormGroup;
  hewanInduk: HewanInduk | null = null;
  fotoFileName = '';

  masterJenisHewan: any[] = [];
  jenisTernakOptions: any[] = [];
  rumpunTernakOptions: any[] = [];

  perkawinanId: number | null = null;
  currentDataTambahan: any = {};
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private populasiService: PopulasiService,
    private perkawinanService: PerkawinanService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.lahirForm = this.fb.group({
      eartagAnak: [''],
      tanggalLahir: ['', Validators.required],
      jenisKelamin: ['', Validators.required],
      kondisi: ['', Validators.required],
      jenisTernakAnak: ['', Validators.required],
      rumpunTernakAnak: [''],
      beratBadan: [''],
      panjangBadan: [''],
      tinggiPundak: [''],
      lingkarDada: [''],
      catatan: [''],
    });
  }

  ngOnInit() {
    this.loadDataMaster();

    this.route.queryParams.subscribe((params) => {
      const id = Number(params['eartagId']) || null;
      this.perkawinanId = id;

      if (id) {
        this.loadHewanInduk(id);
      }
    });

    this.lahirForm
      .get('jenisTernakAnak')
      ?.valueChanges.subscribe((selectedKategori) => {
        this.onJenisTernakChange(selectedKategori);
      });
  }

  loadDataMaster() {
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        this.masterJenisHewan = data;

        const uniqueKategori = Array.from(new Set(data.map((item: any) => item.kategori)));
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });
  }

  onJenisTernakChange(selectedKategori: string) {
    this.rumpunTernakOptions = [];
    if (!selectedKategori) return;

    if (this.lahirForm.get('jenisTernakAnak')?.value !== selectedKategori) {
      this.lahirForm.patchValue({ rumpunTernakAnak: '' });
    }

    const filteredRumpun = this.masterJenisHewan.filter(
      (item) => item.kategori === selectedKategori,
    );
    this.rumpunTernakOptions = filteredRumpun.map((item) => ({
      label: item.nama,
      value: item.nama,
    }));
  }

  async loadHewanInduk(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Memuat data induk...' });
    await loading.present();

    this.perkawinanService.show(id).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        const data = res?.data || null;
        if (!data) {
          await this.showToast('Data induk tidak ditemukan', 'danger');
          return;
        }

        this.currentDataTambahan = data?.data_tambahan || {};

        const jenisRumpun = String(data?.jenis_rumpun || '');
        const [jenis, rumpun] = jenisRumpun.includes(' - ')
          ? jenisRumpun.split(' - ')
          : [data?.populasi?.jenis_hewan || '-', data?.populasi?.ras || jenisRumpun || '-'];

        this.hewanInduk = {
          id: String(data?.id || ''),
          eartagBetina: data?.eartag || data?.populasi?.code || '-',
          jenisTernak: jenis,
          rumpunTernak: rumpun,
        };

        if (!this.lahirForm.get('jenisTernakAnak')?.value && jenis) {
          this.lahirForm.patchValue({ jenisTernakAnak: jenis });
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        await this.showToast(err?.error?.message || 'Gagal memuat data induk', 'danger');
      },
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoFileName = file.name;
    }
  }

  async simpanData() {
    if (!this.lahirForm.valid || !this.perkawinanId) {
      await this.showToast('Mohon isi data kelahiran dengan lengkap', 'warning');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan data kelahiran...' });
    await loading.present();

    const values = this.lahirForm.value;
    const mergedTambahan = {
      ...this.currentDataTambahan,
      lahir: {
        eartag_anak: values.eartagAnak || null,
        tanggal_lahir: values.tanggalLahir,
        jenis_kelamin_anak: values.jenisKelamin,
        kondisi_anak: values.kondisi,
        jenis_ternak_anak: values.jenisTernakAnak,
        rumpun_ternak_anak: values.rumpunTernakAnak || null,
        berat_lahir_anak: values.beratBadan ? Number(values.beratBadan) : null,
        panjang_badan_anak: values.panjangBadan ? Number(values.panjangBadan) : null,
        tinggi_pundak_anak: values.tinggiPundak ? Number(values.tinggiPundak) : null,
        lingkar_dada_anak: values.lingkarDada ? Number(values.lingkarDada) : null,
        foto_anak: this.fotoFileName || null,
        catatan: values.catatan || null,
      },
    };

    const payload: any = {
      status: 'sudah_melahirkan',
      tanggal_kelahiran: values.tanggalLahir,
      data_tambahan: mergedTambahan,
      catatan: values.catatan || this.currentDataTambahan?.catatan || null,
    };

    this.perkawinanService.update(this.perkawinanId, payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isSubmitting = false;

        const alert = await this.alertCtrl.create({
          header: 'Berhasil',
          message: 'Data lahiran berhasil disimpan.',
          buttons: ['OK'],
          cssClass: 'custom-alert',
        });
        await alert.present();
        await alert.onDidDismiss();

        this.router.navigate(['/petugas/perkawinan/riwayat-perkawinan']);
      },
      error: async (err: any) => {
        await loading.dismiss();
        this.isSubmitting = false;
        await this.showToast(err?.error?.message || 'Gagal menyimpan data lahiran', 'danger');
      },
    });
  }

  batal() {
    this.router.navigate(['/petugas/perkawinan/riwayat-perkawinan']);
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
