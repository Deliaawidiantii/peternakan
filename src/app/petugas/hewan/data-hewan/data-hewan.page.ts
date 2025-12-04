import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PopulasiService } from 'src/app/services/populasi.service';
import { WilayahService } from 'src/app/services/wilayah.service';
import { PeternakService } from 'src/app/services/peternak.service';

@Component({
  selector: 'app-data-hewan',
  templateUrl: './data-hewan.page.html',
  styleUrls: ['./data-hewan.page.scss'],
  standalone: true,        // ✅ TAMBAHKAN
  imports: [
    CommonModule,          // ✅ TAMBAHKAN
    FormsModule,           // ✅ AGAR ngModel TIDAK ERROR
    IonicModule            // ✅ AGAR ion-* TERBACA
  ]
})
export class DataHewanPage implements OnInit {
  selectedKategori: string = '';

  formData: any = {
    idKandang: '',
    idPemilik: '',
    desa: '',
    jenisHewan: '',
    jenisHewanLainnya: '',
    jenisKelamin: '',
    umur: '',
  };

  // List untuk dropdown
  desaList: any[] = [];
  kandangList: any[] = [];
  pemilikList: any[] = [];
  
  isLoadingDesa: boolean = false;
  isLoadingKandang: boolean = false;
  isLoadingPemilik: boolean = false;

  jenisHewanOptions: any[] = [];
  currentFormFields: any[] = [];

  kategoriMapping: any = {
    kesayangan: {
      label: 'Hewan Kesayangan',
      jenisHewan: [
        { label: 'Anjing', value: 'anjing' },
        { label: 'Kucing', value: 'kucing' },
        { label: 'Kelinci', value: 'kelinci' },
        { label: 'Burung', value: 'burung' },
        { label: 'Reptil', value: 'reptil' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'warna',
          label: 'Warna',
          type: 'text',
          placeholder: 'Masukkan warna hewan',
        },
        {
          name: 'ukuran',
          label: 'Ukuran',
          type: 'select',
          placeholder: 'Pilih ukuran',
          options: [
            { label: 'Kecil', value: 'kecil' },
            { label: 'Sedang', value: 'sedang' },
            { label: 'Besar', value: 'besar' },
          ],
        },
        {
          name: 'vaksinasi',
          label: 'Status Vaksinasi',
          type: 'select',
          placeholder: 'Pilih status',
          options: [
            { label: 'Sudah', value: 'sudah' },
            { label: 'Belum', value: 'belum' },
          ],
        },
      ],
    },
    ruminansia: {
      label: 'Hewan Ruminansia',
      jenisHewan: [
        { label: 'Sapi', value: 'sapi' },
        { label: 'Kambing', value: 'kambing' },
        { label: 'Domba', value: 'domba' },
        { label: 'Kerbau', value: 'kerbau' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'tinggiPunuk',
          label: 'Tinggi Punuk (cm)',
          type: 'number',
          placeholder: 'Masukkan tinggi punuk',
        },
        {
          name: 'asal',
          label: 'Asal/Ras',
          type: 'text',
          placeholder: 'Contoh: Limosin, Brahman',
        },
        {
          name: 'statusReproduksi',
          label: 'Status',
          type: 'select',
          placeholder: 'Pilih status',
          options: [
            { label: 'Masuk', value: 'masuk' },
            { label: 'Mati', value: 'mati' },
            { label: 'Lahir', value: 'lahir' },
            { label: 'Jual', value: 'dijual' },
          ],
        },
      ],
    },
    unggas: {
      label: 'Hewan Unggas',
      jenisHewan: [
        { label: 'Ayam', value: 'ayam' },
        { label: 'Itik', value: 'itik' },
        { label: 'Angsa', value: 'angsa' },
        { label: 'Kalkun', value: 'kalkun' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'produksi',
          label: 'Jenis Produksi',
          type: 'select',
          placeholder: 'Pilih produksi',
          options: [
            { label: 'Daging', value: 'daging' },
            { label: 'Telur', value: 'telur' },
            { label: 'Dwiguna', value: 'dwiguna' },
          ],
        },
        {
          name: 'asal',
          label: 'Ras/Jenis',
          type: 'text',
          placeholder: 'Contoh: Ayam Kampung, Broiler',
        },
      ],
    },
    primata: {
      label: 'Hewan Primata',
      jenisHewan: [
        { label: 'Monyet', value: 'monyet' },
        { label: 'Kera', value: 'kera' },
        { label: 'Gibbon', value: 'gibbon' },
        { label: 'Lemur', value: 'lemur' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'warna',
          label: 'Warna Bulu',
          type: 'text',
          placeholder: 'Masukkan warna bulu',
        },
        {
          name: 'habitat',
          label: 'Habitat Asal',
          type: 'text',
          placeholder: 'Masukkan habitat asal',
        },
      ],
    },
    lainnya: {
      label: 'Hewan Lainnya',
      jenisHewan: [
        { label: 'Babi', value: 'babi' },
        { label: 'Rusa', value: 'rusa' },
        { label: 'Trenggiling', value: 'trenggiling' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'keterangan',
          label: 'Keterangan Khusus',
          type: 'text',
          placeholder: 'Masukkan informasi tambahan',
        },
      ],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private populasiService: PopulasiService,
    private wilayahService: WilayahService,
    private peternakService: PeternakService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['kategori']) {
        this.selectedKategori = params['kategori'];
        this.updateFormFields();
      }
    });

    // Load semua data dropdown saat page init
    this.loadDesaList();
    this.loadKandangList();
    this.loadPemilikList();
  }

  /**
   * Load data desa dari database
   */
  loadDesaList() {
    this.isLoadingDesa = true;
    
    this.wilayahService.getWilayah().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.desaList = response.data;
          console.log('✅ Data Desa:', this.desaList);
        } else {
          this.useFallbackData();
        }
        this.isLoadingDesa = false;
      },
      error: (err: any) => {
        console.error('❌ Error loading desa:', err);
        this.isLoadingDesa = false;
        this.useFallbackData();
        this.showToast('Gagal memuat data desa', 'warning');
      }
    });
  }

  /**
   * Load data kandang dari database
   */
  loadKandangList() {
    this.isLoadingKandang = true;
    
    // Pakai data dummy untuk sementara
    setTimeout(() => {
      this.kandangList = [
        { id: 1, nama_kandang: 'Kandang A' },
        { id: 2, nama_kandang: 'Kandang B' },
        { id: 3, nama_kandang: 'Kandang C' },
        { id: 4, nama_kandang: 'Kandang D' },
        { id: 5, nama_kandang: 'Kandang E' }
      ];
      this.isLoadingKandang = false;
      console.log('✅ Data kandang dummy loaded:', this.kandangList);
    }, 300);
  }

  /**
   * Load data pemilik/peternak dari database
   */
  loadPemilikList() {
    this.isLoadingPemilik = true;
    
    this.peternakService.getAll().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.pemilikList = response.data;
          console.log('✅ Data Pemilik:', this.pemilikList);
        } else if (Array.isArray(response)) {
          this.pemilikList = response;
        }
        this.isLoadingPemilik = false;
      },
      error: (err: any) => {
        console.error('❌ Error loading pemilik:', err);
        this.isLoadingPemilik = false;
        this.showToast('Gagal memuat data pemilik', 'warning');
      }
    });
  }

  /**
   * Gunakan data fallback untuk desa
   */
  useFallbackData() {
    this.desaList = [
      { id: 1, nama: 'Karangjaya' },
      { id: 2, nama: 'Cikampek' },
      { id: 3, nama: 'Jatisari' }
    ];
    console.log('📋 Menggunakan data fallback:', this.desaList);
  }

  updateFormFields() {
    if (this.selectedKategori && this.kategoriMapping[this.selectedKategori]) {
      const mapping = this.kategoriMapping[this.selectedKategori];
      this.jenisHewanOptions = mapping.jenisHewan;
      this.currentFormFields = mapping.fields;
    }
  }

  toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }


  async pilihKategoriUlang() {
    const buttons: any[] = Object.keys(this.kategoriMapping).map((key) => ({
      text: this.kategoriMapping[key].label,
      handler: () => {
        this.selectedKategori = key;
        this.updateFormFields();
        this.resetForm();
      },
    }));

    buttons.push({
      text: 'Batal',
      role: 'cancel' as any,
    });

    const alert = await this.alertController.create({
      header: 'Pilih Kelompok Hewan',
      buttons: buttons as any,
    });

    await alert.present();
  }

  resetForm() {
    this.formData = {
      idKandang: '',
      idPemilik: '',
      desa: '',
      jenisHewan: '',
      jenisHewanLainnya: '',
      jenisKelamin: '',
      umur: '',
    };
  }

  async simpanData() {
    // Validasi
    if (!this.formData.jenisHewan || !this.formData.jenisKelamin || !this.formData.desa) {
      await this.showToast('Silakan isi semua field yang wajib!', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan data...',
    });
    await loading.present();

    // Prepare data_tambahan object untuk field dinamis
    const dataTambahan: any = {};
    this.currentFormFields.forEach(field => {
      const value = this.formData[field.name];

      if (value !== '' && value !== null && value !== undefined) {
        const snakeKey = this.toSnakeCase(field.name);
        dataTambahan[snakeKey] = value;
      }
    });


    // Prepare Payload sesuai struktur database
    const payload: any = {
      code: this.generateCode(),
      kategori: this.selectedKategori,
      jenis_hewan: this.formData.jenisHewan === 'lainnya_spesifik' 
        ? this.formData.jenisHewanLainnya 
        : this.formData.jenisHewan,
      jenis_kelamin: this.formData.jenisKelamin,
      umur: this.formData.umur || 0,
      jumlah: 1,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'masuk',
      alasan_perubahan: null,
      status_validasi: 'pending',
      data_tambahan: dataTambahan,
      peternakan_id: this.formData.idPemilik || null,
      kandang_id: this.formData.idKandang || null,
      wilayah_id: this.formData.desa,
      petugas_id: this.getPetugasId()
    };

    console.log('📦 data_tambahan:', dataTambahan);
    console.log('📤 full payload:', payload);
    // Call API
    this.populasiService.createPopulasi(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res.success) {
          await this.showToast('Data hewan berhasil disimpan!', 'success');
          this.router.navigate(['/petugas/hewan']);
        } else {
          await this.showToast(res.message || 'Gagal menyimpan data', 'danger');
        }
      },
      error: async (err: any) => {
        await loading.dismiss();
        console.error('❌ Error:', err);
        
        let errorMsg = 'Gagal menyimpan data';
        
        if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error?.errors) {
          const errors = err.error.errors;
          const firstError = Object.keys(errors)[0];
          errorMsg = errors[firstError][0];
        }
        
        await this.showToast(errorMsg, 'danger');
      }
    });
  }
  

  generateCode(): string {
  const kategoriCode = this.selectedKategori.substring(0, 3).toUpperCase();

  const jenis =
    this.formData.jenisHewan === 'lainnya_spesifik'
      ? this.formData.jenisHewanLainnya
      : this.formData.jenisHewan;

  const jenisCode = jenis.substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().slice(-9);

  return `${kategoriCode}-${jenisCode}-${timestamp}`;
}


  getPetugasId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || null;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }

  batal() {
    this.router.navigate(['/petugas/hewan']);
  }

  async showToast(message: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
  
}