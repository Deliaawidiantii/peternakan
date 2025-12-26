import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { KandangService } from 'src/app/services/kandang.service';

@Component({
  selector: 'app-kandang',
  templateUrl: './kandang.page.html',
  styleUrls: ['./kandang.page.scss'],
  standalone: false,
})
export class KandangPage implements OnInit {
  kandangList: any[] = [];
  searchText: string = '';
  selectedDesa: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private kandangService: KandangService
  ) { }

  ngOnInit() {
    this.loadKandang();
  }

  ionViewWillEnter() {
    // Reload data setiap kali halaman dibuka
    this.loadKandang();
  }

  /**
   * Load Data Kandang dari API
   */
  async loadKandang() {
    this.isLoading = true;

    const loading = await this.loadingCtrl.create({
      message: 'Memuat data kandang...',
    });
    await loading.present();

    // Build parameters untuk filter
    const params: any = {};
    if (this.searchText) params.nama_kandang = this.searchText;
    if (this.selectedDesa) params.lokasi = this.selectedDesa;
    if (this.selectedStatus) params.status_kandang = this.selectedStatus;

    this.kandangService.getKandangList(params).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await loading.dismiss();

        if (res.success) {
          this.kandangList = res.data;
          console.log('Data kandang:', this.kandangList); // Debug
        } else {
          this.kandangList = [];
          await this.showToast('Gagal memuat data kandang', 'danger');
        }
      },
      error: async (err) => {
        this.isLoading = false;
        await loading.dismiss();
        console.error('Error loading kandang:', err);
        this.kandangList = []; // Set empty array on error
        await this.showToast('Terjadi kesalahan saat memuat data', 'danger');
      }
    });
  }

  /**
   * Filter by Desa
   */
  filterDesa(event: any) {
    this.selectedDesa = event.detail.value;
    this.loadKandang();
  }

  /**
   * Filter by Status Kandang
   */
  filterStatus(event: any) {
    this.selectedStatus = event.detail.value;
    this.loadKandang();
  }

  /**
   * Search Kandang
   */
  searchKandang(event: any) {
    this.searchText = event.target.value;
    // Debounce search (optional: bisa pakai timer)
    this.loadKandang();
  }

  /**
   * Navigate to Detail Kandang
   */
  goToDetail(id: any) {
    this.router.navigate(['/petugas/detail-kandang', id]);
  }

  /**
   * Navigate to Add Kandang Form
   */
  goToAdd() {
    this.router.navigate(['/petugas/data-kandang']);
  }

  /**
   * Pull to Refresh
   */
  doRefresh(event: any) {
    this.searchText = '';
    this.selectedDesa = '';
    this.selectedStatus = '';
    
    this.kandangService.getKandangList({}).subscribe({
      next: (res) => {
        if (res.success) {
          this.kandangList = res.data;
        }
        event.target.complete();
      },
      error: (err) => {
        console.error('Error refresh:', err);
        event.target.complete();
      }
    });
  }

  /**
   * Show Toast Message
   */
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}