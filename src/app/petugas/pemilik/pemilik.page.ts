import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PeternakService } from '../../services/peternak.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pemilik',
  templateUrl: './pemilik.page.html',
  styleUrls: ['./pemilik.page.scss'],
  standalone: false,
})
export class PemilikPage implements OnInit {

  query: string = '';
  pemilikList: any[] = [];
  filteredPemilik: any[] = [];
  isLoading: boolean = false;

  constructor(
    private navCtrl: NavController,
    private peternakService: PeternakService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadPemilik();
  }

  ionViewWillEnter() {
    // Reload data setiap kali masuk ke page ini
    this.loadPemilik();
  }

  async loadPemilik() {
    this.isLoading = true;

    this.peternakService.getAll().subscribe({
      next: async (response) => {
        this.isLoading = false;

        if (response.success) {
          this.pemilikList = response.data.map((item: any) => ({
            id: item.id,
            name: item.nama_peternak,
            nik: item.nik,
            village: item.wilayah?.nama_desa || 'Tidak ada desa',
            phone: item.no_telp,
            gender: item.jenis_kelamin,
            birthdate: item.tanggal_lahir,
            address: item.alamat,
            color: this.getRandomColor(),
            initials: this.getInitials(item.nama_peternak)
          }));
          this.filteredPemilik = [...this.pemilikList];
        }
      },
      error: async (error) => {
        this.isLoading = false;
        console.error('Error loading pemilik:', error);

        let errorMessage = 'Terjadi kesalahan saat memuat data';
        
        if (error.status === 401) {
          errorMessage = 'Sesi login berakhir. Silakan login kembali.';
          // Redirect ke login
          this.navCtrl.navigateRoot('/login');
        } else if (error.status === 0) {
          errorMessage = 'Tidak dapat terhubung ke server';
        }

        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  filterPemilik() {
    const q = this.query.toLowerCase();
    this.filteredPemilik = this.pemilikList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.nik.includes(q)
    );
  }

  openPemilik(pemilik: any) {
    // Navigasi ke halaman detail pemilik
    this.navCtrl.navigateForward(`/petugas/detail-pemilik/${pemilik.id}`);
  }

  goToAddPemilik() {
    // Navigasi ke form tambah pemilik
    this.navCtrl.navigateForward('/petugas/data-pemilik');
  }


  async deletePemilik(pemilik: any, event: Event) {
    event.stopPropagation(); // Prevent card click

    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: `Apakah Anda yakin ingin menghapus data ${pemilik.name}?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: async () => {
            this.peternakService.delete(pemilik.id).subscribe({
              next: async (response) => {
                const successAlert = await this.alertController.create({
                  header: 'Berhasil',
                  message: 'Data pemilik berhasil dihapus',
                  buttons: ['OK']
                });
                await successAlert.present();

                // Reload data
                this.loadPemilik();
              },
              error: async (error) => {
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Gagal menghapus data',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Helper: Generate random color
  getRandomColor(): string {
    const colors = ['#f4a261', '#2a9d8f', '#e76f51', '#264653', '#e9c46a', '#f1faee'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Helper: Get initials from name
  getInitials(name: string): string {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return words[0][0] + (words[0][1] || '');
  }

  // Pull to refresh
  async doRefresh(event: any) {
    this.peternakService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.pemilikList = response.data.map((item: any) => ({
            id: item.id,
            name: item.nama_peternak,
            nik: item.nik,
            village: item.wilayah?.nama_desa || 'Tidak ada desa',
            phone: item.no_telp,
            gender: item.jenis_kelamin,
            birthdate: item.tanggal_lahir,
            address: item.alamat,
            color: this.getRandomColor(),
            initials: this.getInitials(item.nama_peternak)
          }));
          this.filteredPemilik = [...this.pemilikList];
        }
        event.target.complete();
      },
      error: (error) => {
        console.error('Refresh error:', error);
        event.target.complete();
      }
    });
  }
}
