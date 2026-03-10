import { Component, OnInit } from '@angular/core';
import { PenyakitService } from '../../services/penyakit.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-riwayat-perkembangan-penyakit',
  templateUrl: './riwayat-perkembangan-penyakit.page.html',
  styleUrls: ['./riwayat-perkembangan-penyakit.page.scss'],
  standalone: false,
})
export class RiwayatPerkembanganPenyakitPage implements OnInit {
  selectedComponent: string | null = null;
  semuaKasus: any[] = [];

  // showComponent = false;

  // toggleComponent(){
  //   this.showComponent = !this.showComponent;
  //   console.log('showComponent:', this.showComponent);
  // }

  // backToMain(){
  //   this.showComponent = false;
  // }

  constructor(
    private penyakitService: PenyakitService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // otomatis tampilkan komponen 'terdiagnosa' saat halaman dibuka
    this.selectedComponent = 'terdiagnosa';
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingCtrl.create({ message: 'Memuat data...' });
    await loading.present();

    this.penyakitService.getPenyakit().subscribe({
      next: (res) => {
        loading.dismiss();
        if (res.success || res.status === 'success') {
          this.semuaKasus = res.data || res;
        }
      },
      error: async (err) => {
        loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Gagal memuat riwayat penyakit',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  getFilteredKasus(status: string) {
    return this.semuaKasus.filter(k => k.status_perkembangan === status);
  }

  openComponent(componentName: string) {
    this.selectedComponent = componentName;
  }

  backToMain() {
    this.selectedComponent = null;
  }
}
