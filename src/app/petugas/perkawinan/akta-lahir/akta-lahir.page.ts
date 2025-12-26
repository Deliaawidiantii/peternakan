import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

interface RiwayatPerkawinan {
  id: string;
  status: 'IB' | 'PKB' | 'Lahir';
  hasIB: boolean;
  hasPKB: boolean;
  hasLahir: boolean;
  eartagBetina: string;
  jenisTernak: 'Sapi' | 'Kerbau';
  rumpunTernak: string;
  umurInduk?: number;
  tanggalIB?: string;
  metodePerkawinan: string;
  inseminasiKe?: number;
  usiaInduk?: number;
  kodeProduksi?: string;
  kodeBatch?: string;
  idPejantan?: string;
  tanggalPKB?: string;
  jenisPerkawinan?: 'IB' | 'Alami';
  umurKebuntingan?: number;
  prediksiLahir?: string;
  tanggalLahir?: string;
  jenisKelaminAnak?: 'Jantan' | 'Betina';
  beratLahirAnak?: number;
  kondisiAnak?: string;
  namaPemilik: string;
  nikPemilik: string;
  telpPemilik: string;
  alamatPemilik: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  namaPetugas?: string;
  nikPetugas?: string;
  telpPetugas?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-akta-lahir',
  templateUrl: './akta-lahir.page.html',
  styleUrls: ['./akta-lahir.page.scss'],
  standalone: false
})
export class AktaLahirPage implements OnInit {

  @ViewChild('aktaLahir') aktaLahirRef: any;

  riwayat: RiwayatPerkawinan | null = null;
  eartagId: string = '';
  isLoading = true;
  nomorAkta: string = '';
  tanggalAkta: Date = new Date();
  tanggalPencatatan: Date = new Date();

  // Tab management
  activeTab: string = 'daftar';
  
  // Daftar akta
  daftarAkta: any[] = [];
  filteredDaftarAkta: any[] = [];
  searchTerm: string = '';
  filterTanggal: string = '';

  // Mock data untuk testing
  allRiwayatList: RiwayatPerkawinan[] = [
    {
      id: '1',
      status: 'Lahir',
      hasIB: true,
      hasPKB: true,
      hasLahir: true,
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
      tanggalLahir: '2024-10-10',
      jenisKelaminAnak: 'Jantan',
      beratLahirAnak: 28,
      kondisiAnak: 'Sehat',
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
      updatedAt: '2024-10-10T14:30:00'
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
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController
  ) {
    console.log('AktaLahirPage constructor');
  }

  ngOnInit() {
    console.log('AktaLahirPage ngOnInit');
    this.loadDaftarAkta();
    this.getAktaFromParams();
  }

  getAktaFromParams() {
    this.route.queryParams.subscribe((params: any) => {
      console.log('Query params:', params);
      this.eartagId = params['eartagId'];
      
      console.log('Eartag ID:', this.eartagId);
      
      if (this.eartagId) {
        this.loadAktaData();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadAktaData() {
    console.log('Loading akta data...');
    this.isLoading = true;
    
    // Cari data berdasarkan ID
    const foundRiwayat = this.allRiwayatList.find(item => {
      console.log('Comparing:', item.id, '===', this.eartagId);
      return item.id === this.eartagId;
    });
    
    console.log('Found riwayat:', foundRiwayat);
    
    if (foundRiwayat && foundRiwayat.hasLahir) {
      this.riwayat = foundRiwayat;
      this.nomorAkta = this.generateNomorAkta();
      console.log('Akta Lahir loaded:', this.riwayat);
      console.log('Nomor Akta:', this.nomorAkta);
      this.isLoading = false;
    } else {
      console.warn('Data lahir tidak ditemukan atau belum ada');
      this.riwayat = null;
      this.isLoading = false;
    }
  }

  /**
   * Generate nomor akta
   * Format: AKT-[KABUPATEN]-[TAHUN]-[URUTAN]
   * Contoh: AKT-BD-2024-001
   */
  generateNomorAkta(): string {
    if (!this.riwayat) {
      console.warn('Riwayat belum ada');
      return 'AKT-XXXX-0000-000';
    }

    const kabupatenCode = this.riwayat.kabupaten.substring(0, 2).toUpperCase();
    const tahun = new Date().getFullYear();
    const urutan = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    const nomorGenerated = `AKT-${kabupatenCode}-${tahun}-${urutan}`;
    console.log('Generated nomor akta:', nomorGenerated);
    return nomorGenerated;
  }

  /**
   * Hitung umur induk saat melahirkan
   */
  hitungUmurInduk(): number {
    if (!this.riwayat) {
      return 0;
    }

    // Jika ada umurInduk di data, gunakan itu
    return this.riwayat.umurInduk || 0;
  }

  /**
   * Cetak akta
   */
  printAkta() {
    console.log('Print akta...');
    window.print();
  }

  /**
   * Download PDF (menggunakan print to PDF browser)
   */
  downloadPDF() {
    console.log('Download PDF...');
    
    // Gunakan window.print() untuk print to PDF
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      // Get content dari template
      const content = document.querySelector('.akta-container');
      if (content) {
        printWindow.document.write(content.innerHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  }

  goBack() {
    this.navController.back();
  }

  /**
   * Load daftar akta dari mock data
   */
  loadDaftarAkta() {
    // Mapping allRiwayatList menjadi daftar akta
    this.daftarAkta = this.allRiwayatList
      .filter(item => item.hasLahir)
      .map((item, index) => ({
        ...item,
        nomorAkta: `AKT-${item.kabupaten.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`
      }));

    this.filteredDaftarAkta = [...this.daftarAkta];
    console.log('Daftar akta loaded:', this.daftarAkta);
  }

  /**
   * Filter daftar akta berdasarkan search dan tanggal
   */
  filterDaftarAkta() {
    let filtered = [...this.daftarAkta];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(akta =>
        akta.eartagBetina.toLowerCase().includes(term) ||
        akta.namaPemilik.toLowerCase().includes(term) ||
        akta.desa.toLowerCase().includes(term)
      );
    }

    // Filter by tanggal
    if (this.filterTanggal) {
      filtered = filtered.filter(akta => {
        const aktaTanggal = new Date(akta.tanggalLahir).toISOString().split('T')[0];
        return aktaTanggal === this.filterTanggal;
      });
    }

    this.filteredDaftarAkta = filtered;
  }

  /**
   * View akta detail dari list
   */
  viewAktaDetail(akta: any) {
    this.riwayat = akta;
    this.nomorAkta = akta.nomorAkta;
    this.activeTab = 'detail';
    window.scrollTo(0, 0);
  }

  /**
   * Download akta dari list
   */
  downloadAktaFromList(akta: any) {
    this.riwayat = akta;
    this.nomorAkta = akta.nomorAkta;
    setTimeout(() => {
      this.downloadPDF();
    }, 100);
  }

  /**
   * Print akta dari list
   */
  printAktaFromList(akta: any) {
    this.riwayat = akta;
    this.nomorAkta = akta.nomorAkta;
    setTimeout(() => {
      this.printAkta();
    }, 100);
  }

  /**
   * Tab change handler
   */
  onTabChange() {
    console.log('Active tab:', this.activeTab);
  }
}