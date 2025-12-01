import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-request-kegiatan',
  templateUrl: './request-kegiatan.page.html',
  styleUrls: ['./request-kegiatan.page.scss'],
  standalone: false,
})
export class RequestKegiatanPage implements OnInit {

  requestForm: FormGroup;
  isLoading = false;

  jenisKegiatan = [
    { id: 1, name: 'Pembersihan' },
    { id: 2, name: 'Pemberian Pakan' },
    { id: 3, name: 'Pemeriksaan Kesehatan' },
    { id: 4, name: 'Perawatan Kandang' },
    { id: 5, name: 'Vaksinasi' },
    { id: 6, name: 'Lainnya' }
  ];

  prioritas = [
    { id: 1, name: 'Rendah' },
    { id: 2, name: 'Sedang' },
    { id: 3, name: 'Tinggi' },
    { id: 4, name: 'Urgen' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.requestForm = this.formBuilder.group({
      namaKegiatan: ['', [Validators.required, Validators.minLength(3)]],
      jenisKegiatan: ['', Validators.required],
      deskripsi: ['', [Validators.required, Validators.minLength(10)]],
      prioritas: ['', Validators.required],
      tanggalDimulai: ['', Validators.required],
      waktuMulai: ['', Validators.required],
      estimasiWaktu: ['', Validators.required],
      lokasi: ['', Validators.required],
      penanggungJawab: ['', Validators.required],
      catatan: ['']
    });
  }

  ngOnInit() {
  }

  async submitRequest() {
    if (this.requestForm.invalid) {
      await this.showToast('Mohon lengkapi semua field yang wajib diisi', 'warning');
      return;
    }

    this.isLoading = true;

    // Simulasi API call
    setTimeout(async () => {
      console.log('Form Value:', this.requestForm.value);
      this.isLoading = false;
      await this.showToast('Request kegiatan berhasil dikirim', 'success');
      this.requestForm.reset();
    }, 1500);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  resetForm() {
    this.requestForm.reset();
  }

}