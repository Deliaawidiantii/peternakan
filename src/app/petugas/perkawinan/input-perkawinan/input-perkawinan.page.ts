import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../../services/perkawinan.service';
import { PopulasiService } from '../../../../services/populasi.service';
import { PeternakService } from '../../../../services/peternak.service';

@Component({
  selector: 'app-input-perkawinan',
  templateUrl: './input-perkawinan.page.html',
  styleUrls: ['./input-perkawinan.page.scss'],
  standalone: false,
})
export class InputPerkawinanPage implements OnInit {
  formData = {
    // Data Hewan Betina
    eartagBetina: '',
    jenisTernak: '',
    rumpunTernak: '',
    usiaTernak: '',

    // Data Perkawinan/IB
    idPejantan: '',
    tanggalPerkawinan: '',
    metodePerkawinan: '',
    inseminasiKe: '',
    kodeProduksi: '',
    kodeBatch: '',

    // Data Pemilik
    namaPemilik: '',
    nikPemilik: '',
    alamat: '',
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
    desa: '',

    // Data Backend
    peternakan_id: '',
    populasi_id: '',

    // Upload Foto
    fotoHewan: '',
  };

  isSubmitting = false;

  // Options untuk dropdown (sekarang dinamis berdasarkan API)
  jenisTernakOptions: any[] = [];
  rumpunTernakOptions: any[] = [];
  masterJenisHewan: any[] = [];

  peternakList: any[] = [];

  metodePerkawinanOptions = [
    { label: 'Pilih Metode Perkawinan', value: '' },
    { label: 'Alami', value: 'Alami' },
    { label: 'Inseminasi Buatan', value: 'IB' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];

  inseminasiKeOptions = [
    { label: 'Pilih Inseminasi Ke', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];

  provinsiOptions = [
    { label: 'Pilih Provinsi', value: '' },
    { label: 'Jawa Barat', value: 'jawa_barat' },
    { label: 'Jawa Tengah', value: 'jawa_tengah' },
    { label: 'Jawa Timur', value: 'jawa_timur' },
    { label: 'Kalimantan Selatan', value: 'kalimantan_selatan' },
    { label: 'Sumatera Utara', value: 'sumatera_utara' },
    { label: 'Bali', value: 'bali' },
  ];

  // Data mapping untuk Kabupaten berdasarkan Provinsi
  kabupatenMap: { [key: string]: any[] } = {
    jawa_barat: [
      { label: 'Bogor', value: 'bogor' },
      { label: 'Bandung', value: 'bandung' },
      { label: 'Sukabumi', value: 'sukabumi' },
      { label: 'Cianjur', value: 'cianjur' },
      { label: 'Tasikmalaya', value: 'tasikmalaya' },
    ],
    jawa_tengah: [
      { label: 'Semarang', value: 'semarang' },
      { label: 'Surakarta', value: 'surakarta' },
      { label: 'Pekalongan', value: 'pekalongan' },
      { label: 'Purwokerto', value: 'purwokerto' },
      { label: 'Kudus', value: 'kudus' },
    ],
    jawa_timur: [
      { label: 'Surabaya', value: 'surabaya' },
      { label: 'Malang', value: 'malang' },
      { label: 'Pasuruan', value: 'pasuruan' },
      { label: 'Sidoarjo', value: 'sidoarjo' },
      { label: 'Gresik', value: 'gresik' },
    ],
    kalimantan_selatan: [
      { label: 'Banjarmasin', value: 'banjarmasin' },
      { label: 'Banjarbaru', value: 'banjarbaru' },
      { label: 'Kandangan', value: 'kandangan' },
      { label: 'Martapura', value: 'martapura' },
      { label: 'Tanah Laut', value: 'tanah_laut' },
    ],
    sumatera_utara: [
      { label: 'Medan', value: 'medan' },
      { label: 'Deli Serdang', value: 'deli_serdang' },
      { label: 'Karo', value: 'karo' },
      { label: 'Simalungun', value: 'simalungun' },
      { label: 'Langkat', value: 'langkat' },
    ],
    bali: [
      { label: 'Denpasar', value: 'denpasar' },
      { label: 'Badung', value: 'badung' },
      { label: 'Gianyar', value: 'gianyar' },
      { label: 'Klungkung', value: 'klungkung' },
      { label: 'Tabanan', value: 'tabanan' },
    ],
  };

  // Data mapping untuk Kecamatan
  kecamatanMap: { [key: string]: any[] } = {
    banjarmasin: [
      { label: 'Banjarmasin Timur', value: 'banjarmasin_timur' },
      { label: 'Banjarmasin Barat', value: 'banjarmasin_barat' },
      { label: 'Banjarmasin Selatan', value: 'banjarmasin_selatan' },
      { label: 'Banjarmasin Utara', value: 'banjarmasin_utara' },
    ],
    bogor: [
      { label: 'Bogor Selatan', value: 'bogor_selatan' },
      { label: 'Bogor Timur', value: 'bogor_timur' },
      { label: 'Bogor Barat', value: 'bogor_barat' },
      { label: 'Bogor Utara', value: 'bogor_utara' },
    ],
    bandung: [
      { label: 'Bandung Kulon', value: 'bandung_kulon' },
      { label: 'Bandung Wetan', value: 'bandung_wetan' },
      { label: 'Bandung Lor', value: 'bandung_lor' },
      { label: 'Rancasari', value: 'rancasari' },
    ],
    semarang: [
      { label: 'Semarang Timur', value: 'semarang_timur' },
      { label: 'Semarang Barat', value: 'semarang_barat' },
      { label: 'Semarang Selatan', value: 'semarang_selatan' },
      { label: 'Semarang Utara', value: 'semarang_utara' },
    ],
  };

  // Data mapping untuk Desa
  desaMap: { [key: string]: any[] } = {
    banjarmasin_timur: [
      { label: 'Kuripan', value: 'kuripan' },
      { label: 'Pekapuran Laut', value: 'pekapuran_laut' },
      { label: 'Pekapuran Raya', value: 'pekapuran_raya' },
      { label: 'Basirih', value: 'basirih' },
    ],
    bogor_selatan: [
      { label: 'Cilendek Barat', value: 'cilendek_barat' },
      { label: 'Cilendek Timur', value: 'cilendek_timur' },
      { label: 'Cilendek Tengah', value: 'cilendek_tengah' },
      { label: 'Tanjungsari', value: 'tanjungsari' },
    ],
    bandung_kulon: [
      { label: 'Jajasan', value: 'jajasan' },
      { label: 'Nyengseret', value: 'nyengseret' },
      { label: 'Cigondewah', value: 'cigondewah' },
      { label: 'Ciangsana', value: 'ciangsana' },
    ],
  };

  // List untuk dropdown yang berubah dinamis
  kabupatenList: any[] = [];
  kecamatanList: any[] = [];
  desaList: any[] = [];

  constructor(
    private perkawinanService: PerkawinanService,
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  loadDataMaster() {
    // Ambil data Master Jenis Hewan
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        this.masterJenisHewan = data;

        // Ambil kategori unik untuk option Jenis Ternak
        const uniqueKategori = Array.from(
          new Set(data.map((item: any) => item.kategori)),
        );
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });

    // Ambil data Pemilik (Peternak)
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
      this.formData.nikPemilik = peternak.nik;
      this.formData.alamat = peternak.alamat;
      // Auto-fill Provinsi / Kabupaten based on Wilayah (bisa diadjust kalau wilayah sudah terpadu dengan API)
    }
  }

  onJenisTernakChange(event: any) {
    const selectedKategori = event.detail.value;
    this.formData.jenisTernak = selectedKategori;
    this.formData.rumpunTernak = ''; // Reset rumpun
    this.rumpunTernakOptions = [];

    // Filter rumpunTernakOptions berdasarkan kategori jenisTernak
    const filteredRumpun = this.masterJenisHewan.filter(
      (item) => item.kategori === selectedKategori,
    );
    this.rumpunTernakOptions = filteredRumpun.map((item) => ({
      label: item.nama,
      value: item.nama,
    }));
  }

  goBack() {
    window.history.back();
  }

  onProvinsiChange(event: any) {
    const selectedProvinsi = event.detail.value;
    this.formData.provinsi = selectedProvinsi;
    this.formData.kabupaten = '';
    this.formData.kecamatan = '';
    this.formData.desa = '';
    this.kecamatanList = [];
    this.desaList = [];
    this.kabupatenList = this.kabupatenMap[selectedProvinsi] || [];
  }

  onKabupatenChange(event: any) {
    const selectedKabupaten = event.detail.value;
    this.formData.kabupaten = selectedKabupaten;
    this.formData.kecamatan = '';
    this.formData.desa = '';
    this.desaList = [];
    this.kecamatanList = this.kecamatanMap[selectedKabupaten] || [];
  }

  onKecamatanChange(event: any) {
    const selectedKecamatan = event.detail.value;
    this.formData.kecamatan = selectedKecamatan;
    this.formData.desa = '';
    this.desaList = this.desaMap[selectedKecamatan] || [];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.formData.fotoHewan = file.name;
      console.log('File selected:', file);
    }
  }

  async simpanData() {
    // Validasi form
    if (
      !this.formData.eartagBetina ||
      !this.formData.jenisTernak ||
      !this.formData.rumpunTernak
    ) {
      this.showToast('Mohon isi data hewan betina terlebih dahulu!', 'warning');
      return;
    }

    if (!this.formData.tanggalPerkawinan || !this.formData.metodePerkawinan) {
      this.showToast(
        'Mohon isi data perkawinan/IB terlebih dahulu!',
        'warning',
      );
      return;
    }

    if (!this.formData.namaPemilik) {
      this.showToast('Mohon isi data pemilik terlebih dahulu!', 'warning');
      return;
    }

    // Tampilkan loading
    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan data perkawinan...',
      spinner: 'crescent',
    });
    await loading.present();
    this.isSubmitting = true;

    // Map form data ke format API backend
    const apiData: any = {
      eartag: this.formData.eartagBetina,
      jenis_rumpun: `${this.formData.jenisTernak} - ${this.formData.rumpunTernak}`,
      metode:
        this.formData.metodePerkawinan === 'Inseminasi_Buatan'
          ? 'IB'
          : this.formData.metodePerkawinan,
      tanggal_kawin: this.formData.tanggalPerkawinan,
      status: 'menunggu_pkb',
      catatan: `Inseminasi ke-${this.formData.inseminasiKe || '-'}, Kode Produksi: ${this.formData.kodeProduksi || '-'}, Batch: ${this.formData.kodeBatch || '-'}`,
      data_tambahan: {
        id_pejantan: this.formData.idPejantan,
        usia_ternak: this.formData.usiaTernak,
        nama_pemilik: this.formData.namaPemilik,
        nik_pemilik: this.formData.nikPemilik,
        alamat: this.formData.alamat,
        lokasi: {
          provinsi: this.formData.provinsi,
          kabupaten: this.formData.kabupaten,
          kecamatan: this.formData.kecamatan,
          desa: this.formData.desa,
        },
      },
    };

    // Tambah peternakan_id dan populasi_id jika diisi
    if (this.formData.peternakan_id) {
      apiData.peternakan_id = parseInt(this.formData.peternakan_id);
    }
    if (this.formData.populasi_id) {
      apiData.populasi_id = parseInt(this.formData.populasi_id);
    }

    // Kirim ke backend API
    this.perkawinanService.store(apiData).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        this.isSubmitting = false;
        console.log('Data Perkawinan berhasil disimpan:', response);
        this.showToast('Data Perkawinan berhasil disimpan! ✅', 'success');
        this.resetForm();
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.isSubmitting = false;
        console.error('Error menyimpan data:', error);

        let errorMsg = 'Gagal menyimpan data perkawinan.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors) {
          // Tampilkan validation errors dari Laravel
          const errors = Object.values(error.error.errors).flat();
          errorMsg = (errors as string[]).join(', ');
        } else if (error.status === 401) {
          errorMsg = 'Sesi Anda telah berakhir. Silakan login kembali.';
        }

        this.showToast(errorMsg, 'danger');
      },
    });
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [{ icon: 'close', role: 'cancel' }],
    });
    await toast.present();
  }

  resetForm() {
    this.formData = {
      eartagBetina: '',
      jenisTernak: '',
      rumpunTernak: '',
      usiaTernak: '',
      idPejantan: '',
      tanggalPerkawinan: '',
      metodePerkawinan: '',
      inseminasiKe: '',
      kodeProduksi: '',
      kodeBatch: '',
      namaPemilik: '',
      nikPemilik: '',
      alamat: '',
      provinsi: '',
      kabupaten: '',
      kecamatan: '',
      desa: '',
      peternakan_id: '',
      populasi_id: '',
      fotoHewan: '',
    };
    this.kabupatenList = [];
    this.kecamatanList = [];
    this.desaList = [];
  }
}
