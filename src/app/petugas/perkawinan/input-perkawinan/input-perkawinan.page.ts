import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';

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
  kabupatenMap: { [key: string]: any[] } = {};

  // Data mapping untuk Kecamatan
  kecamatanMap: { [key: string]: any[] } = {};

  // Data mapping untuk Desa
  desaMap: { [key: string]: any[] } = {};

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
      let data: any[] = [];
      if (res.success || res.status === 'success') {
        data = res.data || [];
      } else if (Array.isArray(res)) {
        data = res;
      }
      
      this.masterJenisHewan = data;
      // Ambil kategori unik untuk option Jenis Ternak
      const uniqueKategori = Array.from(
        new Set(data.map((item: any) => item.kategori)),
      );
      this.jenisTernakOptions = uniqueKategori.map((k) => ({
        label: k,
        value: k,
      }));
    });

    // Ambil data ALL Wilayah (Provinsi -> Kabupaten -> Kecamatan -> Desa)
    this.populasiService.getAllWilayahPublic().subscribe((res: any) => {
      let data: any[] = [];
      if (res.success || res.status === 'success') {
        data = res.data || [];
      } else if (Array.isArray(res)) {
        data = res;
      }
      
      // Reset dan Inisialisasi Root Data
      this.provinsiOptions = [{ label: 'Jawa Barat', value: 'jawa_barat' }];
      this.kabupatenMap = { 'jawa_barat': [{ label: 'Karawang', value: 'karawang' }] };
      this.kecamatanMap = { 'karawang': [] };
      this.desaMap = {};
      
      if (data && data.length > 0) {
        // Ekstrak kecamatan unik
        const uniqueKecamatan = Array.from(new Set(data.map((item: any) => item.nama_kecamatan)));
        
        // Isi list kecamatan milik karawang
        this.kecamatanMap['karawang'] = uniqueKecamatan.map((k: any) => ({ label: k, value: k }));
        
        // Buat map desa berdasarkan kecamatan masing-masing
        uniqueKecamatan.forEach((kec: any) => {
          this.desaMap[kec] = data
            .filter((w: any) => w.nama_kecamatan === kec)
            .map((w: any) => ({ label: w.nama_desa, value: w.nama_desa, id: w.id }));
        });
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

  // ============ SEARCHABLE MODAL ============
  isSearchModalOpen = false;
  searchModalTitle = '';
  searchQuery = '';
  searchModalType = '';
  fullSearchList: any[] = [];
  filteredSearchList: any[] = [];

  openSearchModal(type: string) {
    this.searchModalType = type;
    this.searchQuery = '';
    let list: any[] = [];

    switch (type) {
      case 'pemilik':
        this.searchModalTitle = 'Pilih Pemilik';
        list = this.peternakList.map((p) => ({
          label: `${p.nama_peternak} (NIK: ${p.nik})`,
          value: p.id,
          raw: p,
          selected: this.formData.peternakan_id == p.id,
        }));
        break;
      case 'provinsi':
        this.searchModalTitle = 'Pilih Provinsi';
        list = this.provinsiOptions
          .filter((o) => o.value !== '')
          .map((o) => ({
            label: o.label,
            value: o.value,
            selected: this.formData.provinsi === o.value,
          }));
        break;
      case 'kabupaten':
        if (!this.formData.provinsi) return;
        this.searchModalTitle = 'Pilih Kabupaten';
        list = this.kabupatenList.map((o: any) => ({
          label: o.label,
          value: o.value,
          selected: this.formData.kabupaten === o.value,
        }));
        break;
      case 'kecamatan':
        if (!this.formData.kabupaten) return;
        this.searchModalTitle = 'Pilih Kecamatan';
        list = this.kecamatanList.map((o: any) => ({
          label: o.label,
          value: o.value,
          selected: this.formData.kecamatan === o.value,
        }));
        break;
      case 'desa':
        if (!this.formData.kecamatan) return;
        this.searchModalTitle = 'Pilih Desa';
        list = this.desaList.map((o: any) => ({
          label: o.label,
          value: o.value,
          selected: this.formData.desa === o.value,
        }));
        break;
      case 'jenisTernak':
        this.searchModalTitle = 'Pilih Jenis Ternak';
        list = this.jenisTernakOptions.map((o: any) => ({
          label: o.label,
          value: o.value,
          selected: this.formData.jenisTernak === o.value,
        }));
        break;
      case 'rumpunTernak':
        if (!this.formData.jenisTernak) return;
        this.searchModalTitle = 'Pilih Rumpun Ternak';
        list = this.rumpunTernakOptions.map((o: any) => ({
          label: o.label,
          value: o.value,
          selected: this.formData.rumpunTernak === o.value,
        }));
        break;
    }

    this.fullSearchList = list;
    this.filteredSearchList = list;
    this.isSearchModalOpen = true;
  }

  filterSearchList() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredSearchList = this.fullSearchList;
    } else {
      this.filteredSearchList = this.fullSearchList.filter((item) =>
        item.label.toLowerCase().includes(q),
      );
    }
  }

  selectSearchItem(item: any) {
    switch (this.searchModalType) {
      case 'pemilik':
        const p = item.raw;
        this.formData.peternakan_id = p.id;
        this.formData.namaPemilik = p.nama_peternak;
        this.formData.nikPemilik = p.nik;
        this.formData.alamat = p.alamat;
        break;
      case 'provinsi':
        this.formData.provinsi = item.value;
        this.formData.kabupaten = '';
        this.formData.kecamatan = '';
        this.formData.desa = '';
        this.kecamatanList = [];
        this.desaList = [];
        this.kabupatenList = this.kabupatenMap[item.value] || [];
        break;
      case 'kabupaten':
        this.formData.kabupaten = item.value;
        this.formData.kecamatan = '';
        this.formData.desa = '';
        this.desaList = [];
        this.kecamatanList = this.kecamatanMap[item.value] || [];
        break;
      case 'kecamatan':
        this.formData.kecamatan = item.value;
        this.formData.desa = '';
        this.desaList = this.desaMap[item.value] || [];
        break;
      case 'desa':
        this.formData.desa = item.value;
        break;
      case 'jenisTernak':
        this.formData.jenisTernak = item.value;
        this.formData.rumpunTernak = '';
        this.rumpunTernakOptions = [];
        const filteredRumpun = this.masterJenisHewan.filter(
          (i) => i.kategori === item.value,
        );
        this.rumpunTernakOptions = filteredRumpun.map((i) => ({
          label: i.nama,
          value: i.nama,
        }));
        break;
      case 'rumpunTernak':
        this.formData.rumpunTernak = item.value;
        break;
    }
    this.isSearchModalOpen = false;
  }

  getLabel(type: string, value: string): string {
    if (!value) return '';
    let list: any[] = [];
    switch (type) {
      case 'provinsi':
        list = this.provinsiOptions;
        break;
      case 'kabupaten':
        list = this.kabupatenList;
        break;
      case 'kecamatan':
        list = this.kecamatanList;
        break;
      case 'desa':
        list = this.desaList;
        break;
    }
    const found = list.find((o: any) => o.value === value);
    return found ? found.label : value;
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
          const errors = Object.values(error.error.errors).reduce(
            (acc: any, val: any) => acc.concat(val),
            [],
          );
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
