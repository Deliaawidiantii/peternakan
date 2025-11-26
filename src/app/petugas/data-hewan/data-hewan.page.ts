import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-hewan',
  templateUrl: './data-hewan.page.html',
  styleUrls: ['./data-hewan.page.scss'],
  standalone: false,
})
export class DataHewanPage implements OnInit {

  selectedKategori: string = '';
  jenisHewanOptions: any[] = [];

  // Data mapping untuk setiap kategori
  kategoriBintang: any = {
    kesayangan: [
      { label: 'Kucing', value: 'kucing' },
      { label: 'Anjing', value: 'anjing' },
      { label: 'Kelinci', value: 'kelinci' },
      { label: 'Burung', value: 'burung_kesayangan' }
    ],
    ruminansia: [
      { label: 'Sapi', value: 'sapi' },
      { label: 'Kambing', value: 'kambing' },
      { label: 'Domba', value: 'domba' },
      { label: 'Kerbau', value: 'kerbau' }
    ],
    unggas: [
      { label: 'Ayam Kampung', value: 'ayam_kampung' },
      { label: 'Ayam Broiler', value: 'ayam_broiler' },
      { label: 'Itik', value: 'itik' },
      { label: 'Angsa', value: 'angsa' }
    ],
    primata: [
      { label: 'Monyet', value: 'monyet' },
      { label: 'Orang Utan', value: 'orangutan' }
    ],
    lainnya: [
      { label: 'Lainnya', value: 'lainnya' }
    ]
  };

  // Data input KHUSUS untuk setiap kategori (berbeda-beda per kategori)
  formFields: any = {
    kesayangan: [
      { name: 'nama', label: 'Nama Hewan', type: 'text', placeholder: 'Masukan Nama Hewan' },
      { name: 'ras', label: 'Ras', type: 'text', placeholder: 'Masukan Ras' },
      { name: 'umur', label: 'Umur', type: 'text', placeholder: 'Masukan Umur' },
      { name: 'warna', label: 'Warna', type: 'text', placeholder: 'Masukan Warna' },
      { name: 'ID', label: 'ID', type: 'text', placeholder: 'Masukan Id' }

    ],
    ruminansia: [
      { name: 'ID', label: 'ID', type: 'text', placeholder: 'Masukan Nomor ID' },
      { name: 'Ras', label: 'Ras', type: 'text', placeholder: 'Masukan Ras' },
      { name: 'beratBadan', label: 'Berat Badan (kg)', type: 'number', placeholder: 'Masukan Berat Badan' },
      { name: 'umurBulan', label: 'Umur (bulan)', type: 'number', placeholder: 'Masukan Umur' },
      // { name: 'kesehatan', label: 'Kondisi Kesehatan', type: 'select', placeholder: 'Pilih Kondisi',
      //   options: [
      //     { label: 'Sehat', value: 'sehat' },
      //     { label: 'Sakit Ringan', value: 'sakit_ringan' },
      //     { label: 'Sakit Berat', value: 'sakit_berat' }
      //   ]
      // }
    ],
    unggas: [
      { name: 'Ras', label: 'Ras', type: 'text', placeholder: 'Masukan Ras' },
      { name: 'jumlah', label: 'Jumlah', type: 'number', placeholder: 'Masukan Jumlah' },
      { name: 'umurMinggu', label: 'Umur (minggu)', type: 'number', placeholder: 'Masukan Umur' },
      { name: 'beratRata', label: 'Berat Rata-rata (kg)', type: 'number', placeholder: 'Masukan Berat' },
      { name: 'status Prokduksi', label: 'Status-Produksi', type: 'select', placeholder: 'Pilih status produksi',
        options: [
          { label: 'petelur', value: 'petelur' },
          { label: 'pedaging', value: 'pedaging' },
          { label: 'hias', value: 'hias' }
        ]
      }
    ],
    primata: [
      { name: 'nama', label: 'Nama Primata', type: 'text', placeholder: 'Masukan Nama' },
      { name: 'Spesies Primata', label: 'Spesies Primata', type: 'text', placeholder: 'Masukan Spesies Primata' },
      { name: 'umurTahun', label: 'Umur (tahun)', type: 'number', placeholder: 'Masukan Umur' },
      { name: 'Bert Badan', label: 'berat badan', type: 'text', placeholder: 'Masukan berat badan' },
      { name: 'asal', label: 'asal', type: 'select', placeholder: 'asal',
        options: [
          { label: 'Rescue', value: 'Rescue' },
          { label: 'Liar', value: 'Liar' },
          { label: 'Penangkaran', value: 'Penangkaran' }
        ]
      }
    ],
    lainnya: [
      { name: 'Kategori Hewan', label: 'Kategori Hewan', type: 'text', placeholder: 'Kategori Hewan' },
      { name: 'nama', label: 'Nama Hewan', type: 'text', placeholder: 'Masukan Nama' },
      { name: 'Berat/Panjang', label: 'Berat/Panjang', type: 'text', placeholder: 'Masukan Berat/Panjang' },
      // { name: 'ciriKhusus', label: 'Ciri Khusus', type: 'text', placeholder: 'Masukan Ciri Khusus' }
    ]
  };

  // Data form (field yang sama untuk semua kategori)
  formData: any = {
    idKandang: '',
    idPemilik: '',
    desa: '',
    jenisHewan: '',
    jenisKelamin: ''
  };

  constructor() { }

  ngOnInit() {
  }

  // Event ketika kategori dipilih
  onKategoriChange(event: any) {
    const kategori = event.detail.value;
    this.selectedKategori = kategori;
    
    // Update pilihan jenis hewan berdasarkan kategori
    this.jenisHewanOptions = this.kategoriBintang[kategori] || [];
    
    // Reset field yang berubah
    this.formData.jenisHewan = '';
    this.formData.jenisKelamin = '';
  }

  // Getter untuk field khusus kategori (hanya field yang berbeda per kategori)
  get currentFormFields() {
    return this.formFields[this.selectedKategori] || [];
  }

  // Fungsi untuk submit form
  simpanHewan() {
    const dataLengkap = {
      kategori: this.selectedKategori,
      ...this.formData
    };

    console.log('Data Hewan yang disimpan:', dataLengkap);
    
    // Kirim ke API atau proses lanjutan
    // this.hewan.tambahHewan(dataLengkap).subscribe(...);
    
    alert('Data berhasil disimpan!');
  }

  batalForm() {
    this.selectedKategori = '';
    this.jenisHewanOptions = [];
    this.formData = {
      idKandang: '',
      idPemilik: '',
      desa: '',
      jenisHewan: '',
      jenisKelamin: ''
    };
  }

}