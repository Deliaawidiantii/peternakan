import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopulasiService } from '../../services/populasi.service';

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
  isLoading: boolean = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router,
    private populasiService: PopulasiService,
  ) {}

  ngOnInit() {
    this.loadHewan();
  }

  ionViewWillEnter() {
    this.loadHewan();
  }

  loadHewan() {
    this.isLoading = true;

    const params: any = {};
    if (this.selectedJenis) params.jenis_hewan = this.selectedJenis;

    this.populasiService.getPopulasi(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.hewanList = res.data;
          console.log('Data hewan:', this.hewanList);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading hewan:', err);
        this.hewanList = [];
      },
    });
  }

  filterJenis(event: any) {
    this.selectedJenis = event?.detail?.value || event?.target?.value || '';
    this.loadHewan();
  }

  searchHewan(event: any) {
    this.searchText = event.target.value;
    console.log('Search:', this.searchText);
  }

  goToDetail(id: any) {
    this.router.navigate(['/petugas/detail-hewan', id]);
  }

  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Kelompok Hewan',
      buttons: [
        {
          text: 'Kesayangan',
          icon: 'heart-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'kesayangan' },
            });
          },
        },
        {
          text: 'Ruminansia',
          icon: 'paw-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'ruminansia' },
            });
          },
        },
        {
          text: 'Unggas',
          icon: 'egg-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'unggas' },
            });
          },
        },
        {
          text: 'Primata',
          icon: 'people-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'primata' },
            });
          },
        },
        {
          text: 'Lainnya',
          icon: 'help-circle-outline',
          handler: () => {
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'lainnya' },
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
