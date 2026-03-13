import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';
import { PenyakitService } from '../../../services/penyakit.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-laporan-kasus-penyakit',
  templateUrl: './laporan-kasus-penyakit.page.html',
  styleUrls: ['./laporan-kasus-penyakit.page.scss'],
  standalone: false,
})
export class LaporanKasusPenyakitPage implements OnInit {
  masterJenisHewan: any[] = [];
  jenisTernakOptions: any[] = [];
  peternakList: any[] = [];
  populasiList: any[] = []; // Menampung daftar hewan / populasi milih peternak terpilih

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  formData = {
    peternakan_id: '',
    namaPemilik: '',
    jenisTernak: '',
    kategoriHewan: '', // misal: Ruminansia, Unggas
    usia: '',
    populasi_id: '',
    idHewan: '', // diambil dari populasi Eartag/Code
    jenisKelamin: '',
    tanggal: '',
    gejala: '',
  };

  constructor(
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
    private penyakitService: PenyakitService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  loadDataMaster() {
    // Ambil Master Jenis Hewan
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        this.masterJenisHewan = data;

        // Ambil kategori unik
        const uniqueKategori = Array.from(
          new Set(data.map((item: any) => item.kategori)),
        );
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });

    // Ambil Peternak
    this.peternakService.getAll().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        this.peternakList = res.data || [];
      } else if (Array.isArray(res)) {
        this.peternakList = res;
      }
    });
  }

  onPemilikChange(event: any) {
    const selectedId = event.detail.value;
    if (!selectedId) return;

    const peternak = this.peternakList.find((p) => p.id == selectedId);
    if (peternak) {
      this.formData.peternakan_id = peternak.id;
      this.formData.namaPemilik = peternak.nama_peternak;

      // Ambil populasi hewan milik peternak ini (filter via API)
      this.populasiList = [];
      this.populasiService
        .getPopulasi({ peternakan_id: peternak.id })
        .subscribe((res: any) => {
          if (res.success && res.data) {
            // Asumsi struktur API paginate (data direturn di array property index data)
            this.populasiList = res.data;
          }
        });
    }
  }

  onHewanChange(event: any) {
    const selectedPopulasiId = event.detail.value;
    if (!selectedPopulasiId) return;

    const hewan = this.populasiList.find((h) => h.id == selectedPopulasiId);
    if (hewan) {
      this.formData.populasi_id = hewan.id;
      this.formData.idHewan = hewan.code || hewan.eartag;
      this.formData.kategoriHewan = hewan.kategori;
      this.formData.jenisTernak = hewan.jenis_hewan;
      this.formData.jenisKelamin = hewan.jenis_kelamin;
      this.formData.usia = hewan.umur;
    }
  }

  selectPhoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitLaporan() {
    if (!this.formData.peternakan_id || !this.formData.tanggal || !this.formData.gejala) {
      const toast = await this.toastCtrl.create({
        message: 'Mohon lengkapi Pemilik, Tanggal, dan Gejala Penyakit.',
        duration: 2500,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mengirim Laporan...'
    });
    await loading.present();

    const data = new FormData();
    data.append('peternakan_id', this.formData.peternakan_id);
    data.append('tanggal', this.formData.tanggal);
    data.append('deskripsi', this.formData.gejala);
    if (this.formData.idHewan) data.append('code', this.formData.idHewan);
    if (this.formData.kategoriHewan) data.append('klompok', this.formData.kategoriHewan);
    if (this.formData.jenisKelamin) data.append('jekel', this.formData.jenisKelamin);
    if (this.formData.usia) data.append('usia', this.formData.usia);
    if (this.selectedFile) {
      data.append('foto', this.selectedFile);
    }

    this.penyakitService.laporKasus(data).subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res.success) {
          const toast = await this.toastCtrl.create({
            message: 'Berhasil mengirim laporan kasus penyakit.',
            duration: 2500,
            color: 'success'
          });
          toast.present();
          this.router.navigate(['/petugas/penyakit']);
        }
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: err.error?.message || 'Terjadi kesalahan sistem.',
          duration: 2500,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
