import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopulasiService } from '../../services/populasi.service';

interface BirthRecord {
  id: string;
  date: string;
  childId: string;
  parentId: string;
  animalType: string;
  status: string;
  kategori: string;
}

@Component({
  selector: 'app-buku-lahir',
  templateUrl: './buku-lahir.page.html',
  styleUrls: ['./buku-lahir.page.scss'],
  standalone: false,
})
export class BukuLahirPage implements OnInit {
  kelompokHewan: string = '';
  selectedMonth: string = '';
  selectedAnimalType: string = '';
  searchQuery: string = '';
  isLoading = false;

  allBirthRecords: BirthRecord[] = [];
  filteredBirthRecords: BirthRecord[] = [];
  jenisTernakOptions: any[] = [];

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private populasiService: PopulasiService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  ionViewWillEnter() {
    this.loadBirthRecords();
  }

  loadDataMaster() {
    this.populasiService.getJenisHewan().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        const data = res.data || [];
        const uniqueKategori = Array.from(
          new Set(data.map((item: any) => item.kategori)),
        );
        this.jenisTernakOptions = uniqueKategori.map((k) => ({
          label: k,
          value: k,
        }));
      }
    });
  }

  loadBirthRecords() {
    this.isLoading = true;

    // Load populasi with status 'lahir' (birth records)
    this.populasiService.getPopulasi({
      sort: 'desc',
    }).subscribe({
      next: (res: any) => {
        const rawData = res?.data || [];

        // Filter for birth records — either status is 'lahir' or data_tambahan.sumber starts with 'buku_lahir'
        const birthItems = rawData.filter((item: any) => {
          const status = String(item?.status || '').toLowerCase();
          const sumber = String(item?.data_tambahan?.sumber || '').toLowerCase();
          return status === 'lahir' || sumber.startsWith('buku_lahir');
        });

        this.allBirthRecords = birthItems.map((item: any) => this.mapBirthRecord(item));
        this.applyFilters();
        this.isLoading = false;
      },
      error: async (err: any) => {
        this.isLoading = false;
        // If no data from API, show empty state
        this.allBirthRecords = [];
        this.filteredBirthRecords = [];

        const toast = await this.toastCtrl.create({
          message: 'Gagal memuat data kelahiran',
          duration: 2000,
          color: 'danger',
          position: 'bottom',
        });
        await toast.present();
      }
    });
  }

  private mapBirthRecord(item: any): BirthRecord {
    const tambahan = item?.data_tambahan || {};
    const tanggal = item?.tanggal
      ? new Date(item.tanggal).toISOString().split('T')[0]
      : '-';

    return {
      id: String(item?.id || ''),
      date: tanggal,
      childId: item?.code || '-',
      parentId: tambahan?.id_induk || '-',
      animalType: item?.jenis_hewan || item?.kategori || '-',
      status: tambahan?.status_anak || item?.status || '-',
      kategori: item?.kategori || '-',
    };
  }

  // Fungsi filter data berdasarkan bulan, jenis hewan, dan pencarian
  applyFilters() {
    this.filteredBirthRecords = this.allBirthRecords.filter((record) => {
      // Filter berdasarkan bulan
      if (this.selectedMonth) {
        const recordMonth = record.date.split('-')[1];
        if (recordMonth !== this.selectedMonth) {
          return false;
        }
      }

      // Filter berdasarkan jenis hewan
      if (this.selectedAnimalType) {
        if (record.animalType.toLowerCase() !== this.selectedAnimalType.toLowerCase() &&
            record.kategori.toLowerCase() !== this.selectedAnimalType.toLowerCase()) {
          return false;
        }
      }

      // Filter berdasarkan pencarian
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        const searchableText =
          `${record.childId} ${record.parentId} ${record.animalType} ${record.date}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  // Bersihkan semua filter
  clearFilters() {
    this.selectedMonth = '';
    this.selectedAnimalType = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  formatAnimalLabel(type: string): string {
    if (!type) return '-';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  getRecordIconColor(type: string): string {
    const value = (type || '').toLowerCase();
    if (value.includes('sapi')) return 'green';
    if (value.includes('kambing')) return 'orange';
    return 'blue';
  }

  getStatusColor(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'mati') return 'danger';
    if (s === 'cacat') return 'warning';
    return 'success';
  }

  formatStatus(status: string): string {
    if (!status || status === '-') return '-';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  // Pilih kelompok hewan
  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Kelompok Hewan',
      buttons: [
        {
          text: 'Ruminansia',
          icon: 'paw-outline',
          handler: () => {
            this.kelompokHewan = 'Ruminansia';
            this.router.navigate(['/petugas/ruminansia']);
          },
        },
        {
          text: 'Unggas',
          icon: 'egg-outline',
          handler: () => {
            this.kelompokHewan = 'Unggas';
            this.router.navigate(['/petugas/unggas']);
          },
        },
        {
          text: 'Primata',
          icon: 'people-outline',
          handler: () => {
            this.kelompokHewan = 'Primata';
            this.router.navigate(['/petugas/primata']);
          },
        },
        {
          text: 'Kesayangan',
          icon: 'heart-outline',
          handler: () => {
            this.kelompokHewan = 'Kesayangan';
            this.router.navigate(['/petugas/kesayangan']);
          },
        },
        {
          text: 'Batal',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }
}
