import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { AuthService } from '../../../services/auth.service';

interface RiwayatPerkawinan {
  id: string;
  status: 'IB' | 'PKB' | 'Lahir';
  hasIB: boolean;
  hasPKB: boolean;
  hasLahir: boolean;
  eartagBetina: string;
  jenisTernak: string;
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

  allRiwayatList: RiwayatPerkawinan[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private perkawinanService: PerkawinanService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadDaftarAkta();
  }

  getAktaFromParams() {
    this.route.queryParams.subscribe((params: any) => {
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
   * Load daftar akta dari real API
   */
  loadDaftarAkta() {
    this.isLoading = true;
    this.perkawinanService.index().subscribe({
      next: (res: any) => {
        const rawData = res?.data || [];
        
        // Filter only those that already have 'sudah_melahirkan' or 'akta_terbit'
        const bornItems = rawData.filter((item: any) => {
          const s = String(item?.status || '');
          return s === 'sudah_melahirkan' || s === 'akta_terbit';
        });

        this.allRiwayatList = bornItems.map((item: any) => this.mapRiwayatItem(item));

        // Mapping allRiwayatList menjadi daftar akta
        this.daftarAkta = this.allRiwayatList
          .map((item, index) => {
            const rawKab = item.kabupaten && item.kabupaten !== '-' ? item.kabupaten : 'XX';
            const kabCode = rawKab.substring(0, 2).toUpperCase();
            return {
              ...item,
              nomorAkta: `AKT-${kabCode}-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`
            };
          });

        this.filteredDaftarAkta = [...this.daftarAkta];
        this.isLoading = false;
        
        // After loading daftar, try to select one if eartagId is present
        this.getAktaFromParams();
      },
      error: async (err: any) => {
        this.isLoading = false;
        const toast = await this.toastCtrl.create({
          message: err?.error?.message || 'Gagal memuat daftar akta lahir',
          duration: 2200,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  private mapRiwayatItem(item: any): RiwayatPerkawinan {
    const tambahan = item?.data_tambahan || {};
    const lokasi = tambahan?.lokasi || {};
    const statusBackend = String(item?.status || 'menunggu_pkb');

    const hasIB = true;
    const hasPKB = ['sudah_pkb', 'sudah_melahirkan', 'akta_terbit'].includes(statusBackend);
    const hasLahir = ['sudah_melahirkan', 'akta_terbit'].includes(statusBackend);
    const statusLabel: 'IB' | 'PKB' | 'Lahir' = hasLahir ? 'Lahir' : hasPKB ? 'PKB' : 'IB';

    const jenisRumpun = String(item?.jenis_rumpun || '');
    const [jenis, rumpun] = jenisRumpun.includes(' - ')
      ? jenisRumpun.split(' - ')
      : [item?.populasi?.jenis_hewan || '-', item?.populasi?.ras || jenisRumpun || '-'];

    return {
      id: String(item?.id || ''),
      status: statusLabel,
      hasIB,
      hasPKB,
      hasLahir,
      eartagBetina: item?.eartag || item?.populasi?.code || '-',
      jenisTernak: jenis || '-',
      rumpunTernak: rumpun || '-',
      umurInduk: tambahan?.usia_ternak ? Math.floor(Number(tambahan.usia_ternak) / 12) : undefined,
      usiaInduk: Number(tambahan?.usia_ternak || item?.populasi?.umur || 0) || undefined,
      tanggalIB: item?.tanggal_kawin || undefined,
      metodePerkawinan: item?.metode || '-',
      inseminasiKe: tambahan?.inseminasi_ke ? Number(tambahan.inseminasi_ke) : undefined,
      kodeProduksi: tambahan?.kode_produksi || undefined,
      kodeBatch: tambahan?.kode_batch || undefined,
      idPejantan: tambahan?.id_pejantan || undefined,
      tanggalPKB: item?.tanggal_pkb || undefined,
      jenisPerkawinan: item?.metode === 'Alami' ? 'Alami' : 'IB',
      umurKebuntingan: tambahan?.pkb?.umur_kebuntingan ? Number(tambahan.pkb.umur_kebuntingan) : undefined,
      prediksiLahir: tambahan?.pkb?.prediksi_lahir || undefined,
      tanggalLahir: item?.tanggal_kelahiran || undefined,
      jenisKelaminAnak: tambahan?.lahir?.jenis_kelamin_anak || undefined,
      beratLahirAnak: tambahan?.lahir?.berat_lahir_anak ? Number(tambahan.lahir.berat_lahir_anak) : undefined,
      kondisiAnak: tambahan?.lahir?.kondisi_anak || undefined,
      namaPemilik: item?.peternakan?.nama_peternak || tambahan?.nama_pemilik || '-',
      nikPemilik: item?.peternakan?.nik || tambahan?.nik_pemilik || '-',
      telpPemilik: item?.peternakan?.no_telp || tambahan?.telp_pemilik || '-',
      alamatPemilik: item?.peternakan?.alamat || tambahan?.alamat || '-',
      provinsi: lokasi?.provinsi || '-',
      kabupaten: lokasi?.kabupaten || '-',
      kecamatan: lokasi?.kecamatan || '-',
      desa: lokasi?.desa || '-',
      namaPetugas:
        tambahan?.petugas_input_pkb?.nama ||
        tambahan?.petugas_input_ib?.nama ||
        this.authService.getUser()?.nama ||
        '-',
      nikPetugas:
        tambahan?.petugas_input_pkb?.nik ||
        tambahan?.petugas_input_ib?.nik ||
        this.authService.getUser()?.nik ||
        '-',
      telpPetugas:
        tambahan?.petugas_input_pkb?.telp ||
        tambahan?.petugas_input_ib?.telp ||
        this.authService.getUser()?.no_telp ||
        '-',
      foto: tambahan?.foto || undefined,
      createdAt: item?.created_at || new Date().toISOString(),
      updatedAt: item?.updated_at || new Date().toISOString(),
    };
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