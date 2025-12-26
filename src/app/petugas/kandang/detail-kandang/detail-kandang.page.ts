import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // ✅ TAMBAH INI
import { LoadingController, ToastController } from '@ionic/angular'; // ✅ TAMBAH INI
import { KandangService } from 'src/app/services/kandang.service'; // ✅ TAMBAH INI

@Component({
  selector: 'app-detail-kandang',
  templateUrl: './detail-kandang.page.html',
  styleUrls: ['./detail-kandang.page.scss'],
  standalone: false,
})
export class DetailKandangPage implements OnInit {
  
  // ✅ TAMBAH: Variable untuk data kandang
  kandang: any = null;
  isLoading = false;
  kandangId: number = 0;

  constructor(
    private route: ActivatedRoute, // ✅ TAMBAH
    private kandangService: KandangService, // ✅ TAMBAH
    private loadingCtrl: LoadingController, // ✅ TAMBAH
    private toastCtrl: ToastController // ✅ TAMBAH
  ) { }

  ngOnInit() {
    // ✅ TAMBAH: Ambil ID dari URL parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.kandangId = parseInt(id);
      this.loadKandangDetail();
    }
  }

  // ✅ TAMBAH: Method load data dari API
  async loadKandangDetail() {
    this.isLoading = true;

    const loading = await this.loadingCtrl.create({
      message: 'Memuat detail kandang...'
    });
    await loading.present();

    this.kandangService.getKandangById(this.kandangId).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.isLoading = false;

        if (response.success) {
          this.kandang = response.data;
          console.log('Detail kandang:', this.kandang);
        } else {
          await this.showToast('Gagal memuat data', 'danger');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        console.error('Error:', error);
        await this.showToast('Terjadi kesalahan saat memuat data', 'danger');
      }
    });
  }

  // ✅ TAMBAH: Show toast
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