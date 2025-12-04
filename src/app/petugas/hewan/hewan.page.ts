import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopulasiService } from 'src/app/services/populasi.service';

@Component({
  selector: 'app-hewan',
  templateUrl: './hewan.page.html',
  styleUrls: ['./hewan.page.scss'],
  standalone: false,
})
export class HewanPage implements OnInit {
  hewanList: any[] = [];
  searchText: string = '';
  selectedJenis: string = '';
  isLoading: boolean = false; // ← TAMBAHKAN INI

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private populasiService: PopulasiService
  ) {}

  ngOnInit() {
    this.loadHewan();
  }

  ionViewWillEnter() {
    // Reload data setiap kali halaman dibuka
    this.loadHewan();
  }

  async loadHewan() {
    this.isLoading = true; // ← TAMBAHKAN INI
    
    const loading = await this.loadingCtrl.create({
      message: 'Memuat data...',
    });
    await loading.present();

    const params: any = {};
    if (this.selectedJenis) params.jenis_hewan = this.selectedJenis;

    this.populasiService.getPopulasi(params).subscribe({
      next: async (res) => {
        this.isLoading = false; // ← TAMBAHKAN INI
        await loading.dismiss();
        if (res.success) {
          this.hewanList = res.data;
          console.log('Data hewan:', this.hewanList); // Debug
        }
      },
      error: async (err) => {
        this.isLoading = false; // ← TAMBAHKAN INI
        await loading.dismiss();
        console.error('Error loading hewan:', err);
        this.hewanList = []; // Set empty array on error
      }
    });
  }

  filterJenis(event: any) {
    this.selectedJenis = event.target.value;
    this.loadHewan();
  }

  searchHewan(event: any) {
    this.searchText = event.target.value;
    // TODO: Implement search logic
    console.log('Search:', this.searchText);
  }
  goToDetail(id: any) {
  this.router.navigate(['/petugas/detail-hewan', id]);
}


  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
      header: "Pilih Kelompok Hewan",
      buttons: [
        {
          text: 'Kesayangan',
          icon: 'heart-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'kesayangan' }
            });
          },
        },
        {
          text: 'Ruminansia',
          icon: 'paw-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'ruminansia' }
            });
          },
        },
        {
          text: 'Unggas',
          icon: 'egg-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'unggas' }
            });
          },
        },
        {
          text: 'Primata',
          icon: 'people-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'primata' }
            });
          }
        },
        {
          text: 'Lainnya',
          icon: 'help-circle-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'lainnya' }
            });
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