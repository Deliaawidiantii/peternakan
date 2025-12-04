import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-mutasi',
  templateUrl: './detail-mutasi.page.html',
  styleUrls: ['./detail-mutasi.page.scss'],
  standalone: false,
})
export class DetailMutasiPage implements OnInit {

  currentTab = "informasi";

  hewan = {
    kelompokHewan: 'kesayangan',
    jenisHewan: 'Kucing',
    ras: 'Persia',
    idHewan: 'KH-001',
    umur: '2 tahun',
    beratBadan: '4 kg',
  };

  mutasi = {
    jenisMutasi: 'Mati',
    tanggalMutasi: '2024-06-15',
    keterangan: 'Hewan mengalami sakit parah sebelum meninggal.',
    alasanMutasi: 'Sakit',
  };

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  onTabChange(tab: string) {
    this.currentTab = tab;
  }

  async deleteMutasi() {
    const alert = await this.alertController.create({
      header: 'Hapus Mutasi',
      message: 'Apakah Anda yakin ingin menghapus data mutasi ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            console.log('Mutasi dihapus:', this.mutasi);
            this.router.navigate(['/petugas/mutasi']);
          }
        }
      ]
    });

    await alert.present();
  }

  editMutasi() {
    console.log('Edit Mutasi:', this.mutasi);
    // Contoh kalau nanti punya halaman edit:
    this.router.navigate(['/petugas/mutasi/edit-mutasi']);
  }

}
