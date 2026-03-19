import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { PerkawinanService } from '../../../services/perkawinan.service';
import { AuthService } from '../../../services/auth.service';
import html2pdf from 'html2pdf.js';

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

  @ViewChild('aktaLahir') aktaLahirRef!: ElementRef;

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
      
      if (this.eartagId) {
        this.loadAktaData();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadAktaData() {
    this.isLoading = true;
    
    const foundRiwayat = this.allRiwayatList.find(item => {
      return item.id === this.eartagId;
    });
    
    if (foundRiwayat && foundRiwayat.hasLahir) {
      this.riwayat = foundRiwayat;
      this.nomorAkta = this.generateNomorAkta();
      this.isLoading = false;
    } else {
      this.riwayat = null;
      this.isLoading = false;
    }
  }

  generateNomorAkta(): string {
    if (!this.riwayat) {
      return 'AKT-XXXX-0000-000';
    }

    const kabupatenCode = this.riwayat.kabupaten.substring(0, 2).toUpperCase();
    const tahun = new Date().getFullYear();
    const urutan = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    return `AKT-${kabupatenCode}-${tahun}-${urutan}`;
  }

  hitungUmurInduk(): number {
    if (!this.riwayat) {
      return 0;
    }
    return this.riwayat.umurInduk || 0;
  }

  /**
   * Cetak akta
   */
  printAkta() {
    window.print();
  }

  /**
   * Download PDF menggunakan html2pdf.js
   */
  async downloadPDF() {
    const element = document.getElementById('akta-content');
    if (!element) {
      const toast = await this.toastCtrl.create({
        message: 'Konten akta tidak ditemukan. Pilih akta terlebih dahulu.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Menyiapkan PDF...',
      duration: 1500,
      color: 'primary',
      position: 'bottom'
    });
    await toast.present();

    const filename = `Akta_Lahir_${this.riwayat?.eartagBetina || 'Ternak'}_${this.nomorAkta}.pdf`;

    const opt: any = {
      margin:       [10, 10, 10, 10],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();

      const successToast = await this.toastCtrl.create({
        message: 'PDF berhasil diunduh!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await successToast.present();
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorToast = await this.toastCtrl.create({
        message: 'Gagal membuat PDF. Silakan coba lagi.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await errorToast.present();
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

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(akta =>
        akta.eartagBetina.toLowerCase().includes(term) ||
        akta.namaPemilik.toLowerCase().includes(term) ||
        akta.desa.toLowerCase().includes(term)
      );
    }

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
    this.activeTab = 'detail';
    // Wait for view to render before generating PDF
    setTimeout(() => {
      this.downloadPDF();
    }, 500);
  }

  /**
   * Print akta dari list
   */
  printAktaFromList(akta: any) {
    this.riwayat = akta;
    this.nomorAkta = akta.nomorAkta;
    this.activeTab = 'detail';
    setTimeout(() => {
      this.printAkta();
    }, 500);
  }

  /**
   * Tab change handler
   */
  onTabChange() {
    // no-op
  }
}