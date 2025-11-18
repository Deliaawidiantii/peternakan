import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface BirthDetail {
  birthDate: string;
  childId: string;
  animalType: string;
  childCount: number;
  parentId: string;
  status: string;
}

@Component({
  selector: 'app-detail-kelahiran',
  templateUrl: './detail-kelahiran.page.html',
  styleUrls: ['./detail-kelahiran.page.scss'],
  standalone: false
})
export class DetailKelahiranPage implements OnInit {

  birthDetail: BirthDetail = {
    birthDate: '18 Agustus 2024',
    childId: 'AN-S-KRW-0824-001',
    animalType: 'Sapi',
    childCount: 1,
    parentId: 'IN-S-KRW-0034',
    status: 'Normal'
  };

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Load data dari service atau route params
    // this.loadBirthDetail();
  }

  // Hapus catatan kelahiran
  async deleteRecord() {
    const alert = await this.alertController.create({
      header: 'Hapus Catatan',
      message: 'Apakah Anda yakin ingin menghapus catatan kelahiran ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            console.log('Catatan dihapus');
            // this.deleteService.deleteRecord(this.birthDetail.childId);
            this.router.navigate(['/buku-lahir']);
          }
        }
      ]
    });

    await alert.present();
  }

  // Edit data kelahiran
  editRecord() {
    console.log('Edit data:', this.birthDetail);
    // this.router.navigate(['/edit-kelahiran', this.birthDetail.childId]);
  }

}