import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

interface RiwayatPerkawinan {
  id: string;

  // progress Status
  status: 'IB' | 'PKB' | 'Lahir';
  hasIB : boolean;
  hasPKB : boolean;
  hasLahir : boolean;

  // data ternak 
  eartagBetina : string;
  jenisTernak: 'Sapi' | 'Kerbau' ;
  rumpunTernak : string;
  umurInduk? : number;

  // data IB
  tanggalIB? : string;
  metodePerkawinan : string;
  inseminasiKe? : number;
  usiaInduk? : number;
  kodeProduksi? : string;
  kodeBatch? : string;
  idPejantan? : string;

  // data PKB
  tanggalPKB? : string;
  jenisPerkawinan? : 'IB' | 'Alami';
  umurKebuntingan? : number;
  prediksiLahir? : string;

  // data Lahir
  tanggalLahir? : string;
  jenisKelaminAnak? : 'Jantan' | 'Betina';
  beratLahirAnak? : number;
  kondisiAnak? : string;

  // data Pemilik
  namaPemilik : string;
  nikPemilik : string;
  telpPemilik : string;
  alamatPemilik : string;
  provinsi : string;
  kabupaten : string;
  kecamatan : string;
  desa : string;

  // Petugas (UNCOMMENTED)
  namaPetugas?: string;
  nikPetugas?: string;
  telpPetugas?: string;

  // foto
  foto? : string;

  // metadata
  createdAt : string;
  updatedAt : string;
}

@Component({
  selector: 'app-riwayat-perkawinan',
  templateUrl: './riwayat-perkawinan.page.html',
  styleUrls: ['./riwayat-perkawinan.page.scss'],
  standalone: false,
})
export class RiwayatPerkawinanPage implements OnInit {

  // Data riwayat
  riwayatList: RiwayatPerkawinan[] = [];
  filteredRiwayat: RiwayatPerkawinan[] = [];

  // Filter & Search
  searchTerm: string = '';
  filterStatus: string = 'semua';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadRiwayatData();
  }

  ionViewWillEnter() {
    // Reload data setiap kali page muncul
    this.loadRiwayatData();
  }

  loadRiwayatData() {
    // TODO: Replace dengan API call
    // const data = await this.apiService.getRiwayat();
    
    // Dummy data untuk testing
    this.riwayatList = [
      {
        id: '1',
        status: 'PKB',
        hasIB: true,
        hasPKB: true,
        hasLahir: false,
        eartagBetina: 'ID-001-2024',
        jenisTernak: 'Sapi',
        rumpunTernak: 'Simental',
        umurInduk: 4,
        usiaInduk: 48,
        tanggalIB: '2024-01-15',
        metodePerkawinan: 'IB',
        inseminasiKe: 1,
        kodeProduksi: 'SP-001',
        kodeBatch: 'B-2024-01',
        idPejantan: 'PJ-001',
        tanggalPKB: '2024-02-20',
        jenisPerkawinan: 'IB',
        umurKebuntingan: 2,
        prediksiLahir: '2024-10-15',
        namaPemilik: 'Budi Santoso',
        nikPemilik: '3201234567890001',
        telpPemilik: '081234567890',
        alamatPemilik: 'Jl. Merdeka No. 123',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Cibiru',
        desa: 'Cipadung',
        namaPetugas: 'Dr. Ahmad Fauzi',
        nikPetugas: '3201234567890123',
        telpPetugas: '081234567890',
        foto: 'path/to/photo.jpg',
        createdAt: '2024-01-15T10:00:00',
        updatedAt: '2024-02-20T14:30:00'
      },
      {
        id: '2',
        status: 'Lahir',
        hasIB: true,
        hasPKB: true,
        hasLahir: true,
        eartagBetina: 'ID-002-2024',
        jenisTernak: 'Kerbau',
        rumpunTernak: 'Kerbau Lumpur',
        umurInduk: 5,
        usiaInduk: 60,
        tanggalIB: '2023-12-10',
        metodePerkawinan: 'Alam',
        tanggalPKB: '2024-01-15',
        jenisPerkawinan: 'Alami',
        umurKebuntingan: 3,
        prediksiLahir: '2024-09-10',
        tanggalLahir: '2024-09-08',
        jenisKelaminAnak: 'Betina',
        beratLahirAnak: 32,
        kondisiAnak: 'Sehat',
        namaPemilik: 'Siti Rahayu',
        nikPemilik: '3201234567890002',
        telpPemilik: '081234567891',
        alamatPemilik: 'Jl. Raya Rancasari No. 45',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Rancasari',
        desa: 'Cipamokolan',
        namaPetugas: 'Dr. Ahmad Fauzi',
        nikPetugas: '3201234567890123',
        telpPetugas: '081234567890',
        foto: 'path/to/photo2.jpg',
        createdAt: '2023-12-10T09:00:00',
        updatedAt: '2024-09-08T08:15:00'
      },
      {
        id: '3',
        status: 'IB',
        hasIB: true,
        hasPKB: false,
        hasLahir: false,
        eartagBetina: 'ID-003-2024',
        jenisTernak: 'Sapi',
        rumpunTernak: 'PO',
        usiaInduk: 36,
        tanggalIB: '2024-03-01',
        metodePerkawinan: 'IB',
        inseminasiKe: 2,
        kodeProduksi: 'SP-002',
        kodeBatch: 'B-2024-03',
        idPejantan: 'PJ-002',
        namaPemilik: 'Joko Widodo',
        nikPemilik: '3201234567890003',
        telpPemilik: '081234567892',
        alamatPemilik: 'Jl. Pasir Biru No. 88',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Cibiru',
        desa: 'Pasir Biru',
        namaPetugas: 'Dr. Sinta Maharani',
        nikPetugas: '3201234567890124',
        telpPetugas: '081234567891',
        foto: 'path/to/photo3.jpg',
        createdAt: '2024-03-01T11:00:00',
        updatedAt: '2024-03-01T11:00:00'
      },
      {
        id: '4',
        status: 'IB',
        hasIB: true,
        hasPKB: false,
        hasLahir: false,
        eartagBetina: 'ID-004-2024',
        jenisTernak: 'Sapi',
        rumpunTernak: 'Brahmana',
        usiaInduk: 42,
        tanggalIB: '2024-03-15',
        metodePerkawinan: 'IB',
        inseminasiKe: 1,
        kodeProduksi: 'SP-003',
        kodeBatch: 'B-2024-03',
        idPejantan: 'PJ-003',
        namaPemilik: 'Rina Susanti',
        nikPemilik: '3201234567890004',
        telpPemilik: '081234567893',
        alamatPemilik: 'Jl. Cicadas No. 12',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Cibeunying',
        desa: 'Cicadas',
        namaPetugas: 'Dr. Budi Setiawan',
        nikPetugas: '3201234567890125',
        telpPetugas: '081234567892',
        createdAt: '2024-03-15T09:30:00',
        updatedAt: '2024-03-15T09:30:00'
      },
      {
        id: '5',
        status: 'PKB',
        hasIB: true,
        hasPKB: true,
        hasLahir: false,
        eartagBetina: 'ID-005-2024',
        jenisTernak: 'Kerbau',
        rumpunTernak: 'Kerbau Sungai',
        umurInduk: 6,
        usiaInduk: 72,
        tanggalIB: '2023-11-20',
        metodePerkawinan: 'Alam',
        tanggalPKB: '2024-01-10',
        jenisPerkawinan: 'Alami',
        umurKebuntingan: 4,
        prediksiLahir: '2024-08-20',
        namaPemilik: 'Ahmad Yani',
        nikPemilik: '3201234567890005',
        telpPemilik: '081234567894',
        alamatPemilik: 'Jl. Surapati No. 67',
        provinsi: 'Jawa Barat',
        kabupaten: 'Bandung',
        kecamatan: 'Cicendo',
        desa: 'Surapati',
        namaPetugas: 'Dr. Ahmad Fauzi',
        nikPetugas: '3201234567890123',
        telpPetugas: '081234567890',
        foto: 'path/to/photo5.jpg',
        createdAt: '2023-11-20T14:00:00',
        updatedAt: '2024-01-10T11:20:00'
      }
    ];

    this.filteredRiwayat = [...this.riwayatList];
  }

  /**
   * Filter data berdasarkan status
   */
  onFilterChange() {
    this.applyFilters();
  }

  /**
   * Search data
   */
  onSearch() {
    this.applyFilters();
  }

  /**
   * Apply all filters
   */
  applyFilters() {
    let filtered = [...this.riwayatList];

    // Filter by status
    if (this.filterStatus !== 'semua') {
      filtered = filtered.filter(item => {
        if (this.filterStatus === 'ib') return item.hasIB && !item.hasPKB;
        if (this.filterStatus === 'pkb') return item.hasPKB && !item.hasLahir;
        if (this.filterStatus === 'lahir') return item.hasLahir;
        return true;
      });
    }

    // Filter by search term
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.eartagBetina.toLowerCase().includes(term) ||
        item.namaPemilik.toLowerCase().includes(term) ||
        item.desa.toLowerCase().includes(term) ||
        item.kecamatan.toLowerCase().includes(term) ||
        item.rumpunTernak.toLowerCase().includes(term)
      );
    }

    this.filteredRiwayat = filtered;
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    switch(status) {
      case 'IB': return 'primary';
      case 'PKB': return 'warning';
      case 'Lahir': return 'success';
      default: return 'medium';
    }
  }

  /**
   * Open detail page (Navigate ke detail-riwayat-perkawinan)
   */
  async openDetail(item: RiwayatPerkawinan, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    // Navigate ke page detail dengan queryParams
    this.router.navigate(['/petugas/perkawinan/detail-riwayat-perkawinan'], {
      queryParams: {
        eartagId: item.id,
        eartag: item.eartagBetina
      }
    });
  }



  /**
   * Format date to readable format
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  }

  /**
   * View photo
   */
  async viewPhoto(item: RiwayatPerkawinan, event: Event) {
    event.stopPropagation();
    
    // TODO: Implement photo viewer modal
    const alert = await this.alertCtrl.create({
      header: 'Foto',
      message: `Menampilkan foto untuk ${item.eartagBetina}<br><br>
                <img src="${item.foto}" style="width: 100%; border-radius: 8px;" onerror="this.src='assets/img/no-image.png'">`,
      cssClass: 'photo-alert',
      buttons: ['Tutup']
    });

    await alert.present();
  }

  /**
   * Update progress (PKB atau Lahiran)
   */
  async updateProgress(item: RiwayatPerkawinan, event: Event) {
    event.stopPropagation();

    if (!item.hasPKB) {
      // Redirect ke halaman input PKB
      this.router.navigate(['petugas/perkawinan/input-pkb'], { 
        queryParams: { 
          eartagId: item.id,
          eartag: item.eartagBetina 
        } 
      });
    } else if (!item.hasLahir) {
      // Redirect ke halaman input lahiran
      this.router.navigate(['/petugas/perkawinan/lahir'], { 
        queryParams: { 
          eartagId: item.id,
          eartag: item.eartagBetina 
        } 
      });
    }
  }

  /**
   * Show filter modal
   */
  async showFilterModal() {
    const alert = await this.alertCtrl.create({
      header: 'Filter Riwayat',
      inputs: [
        {
          type: 'radio',
          label: 'Semua Data',
          value: 'semua',
          checked: this.filterStatus === 'semua'
        },
        {
          type: 'radio',
          label: 'IB Saja',
          value: 'ib',
          checked: this.filterStatus === 'ib'
        },
        {
          type: 'radio',
          label: 'Sudah PKB',
          value: 'pkb',
          checked: this.filterStatus === 'pkb'
        },
        {
          type: 'radio',
          label: 'Sudah Lahir',
          value: 'lahir',
          checked: this.filterStatus === 'lahir'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Terapkan',
          handler: (data) => {
            this.filterStatus = data;
            this.applyFilters();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Navigate to input IB page
   */
  goToInputIB() {
    this.router.navigate(['/input-ib']);
  }

  /**
   * Refresh data
   */
  doRefresh(event: any) {
    setTimeout(() => {
      this.loadRiwayatData();
      event.target.complete();
    }, 1000);
  }
}