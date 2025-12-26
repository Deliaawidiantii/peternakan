import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-perkawinan',
  templateUrl: './input-perkawinan.page.html',
  styleUrls: ['./input-perkawinan.page.scss'],
  standalone: false,
})
export class InputPerkawinanPage implements OnInit {

  formData = {
    // Data Petugas
    // namaPetugas: '',
    // nikPetugas: '',
    // noTelp: '',
    
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
    
    // Upload Foto
    fotoHewan: ''
  };

  // Options untuk dropdown
  jenisTernakOptions = [
    { label: 'Pilih Jenis Ternak', value: '' },
    { label: 'Sapi', value: 'sapi' },
    { label: 'Kerbau', value: 'kerbau' }
  ];

  rumpunTernakOptions = [
    { label: 'Pilih Rumpun Ternak', value: '' },
    { label: 'PO', value: 'po' },
    { label: 'Brahman', value: 'brahman' },
    { label: 'Simental', value: 'simental' },
    { label: 'Limosin', value: 'limosin' },
    { label: 'Pasundan', value: 'pasundan' },
    { label: 'Kerbau Sungai', value: 'kerbau_sungai' },
    { label: 'Kerbau Lumpur', value: 'kerbau_lumpur' }
  ];

  metodePerkawinanOptions = [
    { label: 'Pilih Metode Perkawinan', value: '' },
    { label: 'Alami', value: 'Alami' },
    { label: 'Inseminasi Buatan', value: 'Inseminasi_Buatan' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];

  inseminasiKeOptions = [
    { label: 'Pilih Inseminasi Ke', value: '' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' }
  ];

  provinsiOptions = [
    { label: 'Pilih Provinsi', value: '' },
    { label: 'Jawa Barat', value: 'jawa_barat' },
    { label: 'Jawa Tengah', value: 'jawa_tengah' },
    { label: 'Jawa Timur', value: 'jawa_timur' },
    { label: 'Kalimantan Selatan', value: 'kalimantan_selatan' },
    { label: 'Sumatera Utara', value: 'sumatera_utara' },
    { label: 'Bali', value: 'bali' }
  ];

  // Data mapping untuk Kabupaten berdasarkan Provinsi
  kabupatenMap: { [key: string]: any[] } = {
    'jawa_barat': [
      { label: 'Bogor', value: 'bogor' },
      { label: 'Bandung', value: 'bandung' },
      { label: 'Sukabumi', value: 'sukabumi' },
      { label: 'Cianjur', value: 'cianjur' },
      { label: 'Tasikmalaya', value: 'tasikmalaya' }
    ],
    'jawa_tengah': [
      { label: 'Semarang', value: 'semarang' },
      { label: 'Surakarta', value: 'surakarta' },
      { label: 'Pekalongan', value: 'pekalongan' },
      { label: 'Purwokerto', value: 'purwokerto' },
      { label: 'Kudus', value: 'kudus' }
    ],
    'jawa_timur': [
      { label: 'Surabaya', value: 'surabaya' },
      { label: 'Malang', value: 'malang' },
      { label: 'Pasuruan', value: 'pasuruan' },
      { label: 'Sidoarjo', value: 'sidoarjo' },
      { label: 'Gresik', value: 'gresik' }
    ],
    'kalimantan_selatan': [
      { label: 'Banjarmasin', value: 'banjarmasin' },
      { label: 'Banjarbaru', value: 'banjarbaru' },
      { label: 'Kandangan', value: 'kandangan' },
      { label: 'Martapura', value: 'martapura' },
      { label: 'Tanah Laut', value: 'tanah_laut' }
    ],
    'sumatera_utara': [
      { label: 'Medan', value: 'medan' },
      { label: 'Deli Serdang', value: 'deli_serdang' },
      { label: 'Karo', value: 'karo' },
      { label: 'Simalungun', value: 'simalungun' },
      { label: 'Langkat', value: 'langkat' }
    ],
    'bali': [
      { label: 'Denpasar', value: 'denpasar' },
      { label: 'Badung', value: 'badung' },
      { label: 'Gianyar', value: 'gianyar' },
      { label: 'Klungkung', value: 'klungkung' },
      { label: 'Tabanan', value: 'tabanan' }
    ]
  };

  // Data mapping untuk Kecamatan
  kecamatanMap: { [key: string]: any[] } = {
    'banjarmasin': [
      { label: 'Banjarmasin Timur', value: 'banjarmasin_timur' },
      { label: 'Banjarmasin Barat', value: 'banjarmasin_barat' },
      { label: 'Banjarmasin Selatan', value: 'banjarmasin_selatan' },
      { label: 'Banjarmasin Utara', value: 'banjarmasin_utara' }
    ],
    'bogor': [
      { label: 'Bogor Selatan', value: 'bogor_selatan' },
      { label: 'Bogor Timur', value: 'bogor_timur' },
      { label: 'Bogor Barat', value: 'bogor_barat' },
      { label: 'Bogor Utara', value: 'bogor_utara' }
    ],
    'bandung': [
      { label: 'Bandung Kulon', value: 'bandung_kulon' },
      { label: 'Bandung Wetan', value: 'bandung_wetan' },
      { label: 'Bandung Lor', value: 'bandung_lor' },
      { label: 'Rancasari', value: 'rancasari' }
    ],
    'semarang': [
      { label: 'Semarang Timur', value: 'semarang_timur' },
      { label: 'Semarang Barat', value: 'semarang_barat' },
      { label: 'Semarang Selatan', value: 'semarang_selatan' },
      { label: 'Semarang Utara', value: 'semarang_utara' }
    ]
  };

  // Data mapping untuk Desa
  desaMap: { [key: string]: any[] } = {
    'banjarmasin_timur': [
      { label: 'Kuripan', value: 'kuripan' },
      { label: 'Pekapuran Laut', value: 'pekapuran_laut' },
      { label: 'Pekapuran Raya', value: 'pekapuran_raya' },
      { label: 'Basirih', value: 'basirih' }
    ],
    'bogor_selatan': [
      { label: 'Cilendek Barat', value: 'cilendek_barat' },
      { label: 'Cilendek Timur', value: 'cilendek_timur' },
      { label: 'Cilendek Tengah', value: 'cilendek_tengah' },
      { label: 'Tanjungsari', value: 'tanjungsari' }
    ],
    'bandung_kulon': [
      { label: 'Jajasan', value: 'jajasan' },
      { label: 'Nyengseret', value: 'nyengseret' },
      { label: 'Cigondewah', value: 'cigondewah' },
      { label: 'Ciangsana', value: 'ciangsana' }
    ]
  };

  // List untuk dropdown yang berubah dinamis
  kabupatenList: any[] = [];
  kecamatanList: any[] = [];
  desaList: any[] = [];

  constructor() { }

  ngOnInit() {
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

  simpanData() {
    // Validasi form
    // if (!this.formData.namaPetugas || !this.formData.nikPetugas || !this.formData.noTelp) {
    //   alert('Mohon isi data petugas terlebih dahulu!');
    //   return;
    // }

    if (!this.formData.eartagBetina || !this.formData.jenisTernak || !this.formData.rumpunTernak) {
      alert('Mohon isi data hewan betina terlebih dahulu!');
      return;
    }

    if (!this.formData.idPejantan || !this.formData.tanggalPerkawinan || !this.formData.metodePerkawinan) {
      alert('Mohon isi data perkawinan/IB terlebih dahulu!');
      return;
    }

    if (!this.formData.namaPemilik || !this.formData.nikPemilik || !this.formData.alamat) {
      alert('Mohon isi data pemilik terlebih dahulu!');
      return;
    }

    console.log('Data Perkawinan Disimpan:', this.formData);

    // logic backend

    alert('Data Perkawinan berhasil disimpan!');
    // reset form setelah berhasil 

    this.resetForm();
  }

  resetForm() {
    this.formData = {
      // namaPetugas: '',
      // nikPetugas: '',
      // noTelp: '',
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
      fotoHewan: ''
    };
    this.kabupatenList = [];
    this.kecamatanList = [];
    this.desaList = [];
  }

}