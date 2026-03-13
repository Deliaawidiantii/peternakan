import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ToastController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { KegiatanService } from '../../../services/kegiatan.service';
import { PeternakService } from '../../../services/peternak.service';

@Component({
  selector: 'app-request-kegiatan',
  templateUrl: './request-kegiatan.page.html',
  styleUrls: ['./request-kegiatan.page.scss'],
  standalone: false,
})
export class RequestKegiatanPage implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  peternakList: any[] = [];

  jenisKegiatan = [
    { id: 'Pembersihan', name: 'Pembersihan Kandang' },
    { id: 'Pemberian Pakan', name: 'Pemberian Pakan' },
    { id: 'Pemeriksaan Kesehatan', name: 'Pemeriksaan Kesehatan' },
    { id: 'Perawatan Kandang', name: 'Perawatan Kandang' },
    { id: 'Vaksinasi', name: 'Vaksinasi' },
    { id: 'Inseminasi', name: 'Inseminasi Buatan' },
    { id: 'Lainnya', name: 'Lainnya' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private kegiatanService: KegiatanService,
    private peternakService: PeternakService,
  ) {
    this.requestForm = this.formBuilder.group({
      jenis: ['', Validators.required],
      deskripsi: ['', [Validators.required, Validators.minLength(5)]],
      tanggal: ['', Validators.required],
      jam_mulai: ['', Validators.required],
      jam_selesai: ['', Validators.required],
      lokasi: ['', Validators.required],
      peternakan_id: [''],
    });
  }

  ngOnInit() {
    this.loadPeternak();
  }

  loadPeternak() {
    this.peternakService.getAll().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        this.peternakList = res.data || [];
      } else if (Array.isArray(res)) {
        this.peternakList = res;
      }
    });
  }

  async submitRequest() {
    if (this.requestForm.invalid) {
      await this.showToast(
        'Mohon lengkapi semua field yang wajib diisi',
        'warning',
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mengirim request...',
    });
    await loading.present();
    this.isLoading = true;

    // Call API Store Kegiatan
    const payload = { ...this.requestForm.value };

    // Convert date dan time format yang sesuai jika dari ionic datetime picker
    if (payload.tanggal && payload.tanggal.includes('T')) {
      payload.tanggal = payload.tanggal.split('T')[0];
    }
    if (payload.jam_mulai && payload.jam_mulai.includes('T')) {
      const d = new Date(payload.jam_mulai);
      payload.jam_mulai = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    if (payload.jam_mulai) {
      payload.jam_mulai = String(payload.jam_mulai).replace('.', ':').slice(0, 5);
    }

    if (payload.jam_selesai && payload.jam_selesai.includes('T')) {
      const d = new Date(payload.jam_selesai);
      payload.jam_selesai = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    if (payload.jam_selesai) {
      payload.jam_selesai = String(payload.jam_selesai).replace('.', ':').slice(0, 5);
    }

    this.kegiatanService.requestKegiatan(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.isLoading = false;
        await this.showToast('Request kegiatan berhasil dikirim', 'success');
        this.requestForm.reset();
        this.navCtrl.navigateBack('/petugas/kegiatan');
      },
      error: async (err) => {
        await loading.dismiss();
        this.isLoading = false;
        const backendMessage =
          err?.error?.message ||
          (err?.error?.errors ? Object.values(err.error.errors).flat().join(' | ') : null) ||
          'Gagal mengirim request';

        await this.showToast(String(backendMessage), 'danger');
        console.error(err);
      },
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  resetForm() {
    this.requestForm.reset();
  }
}
