import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hewan',
  templateUrl: './hewan.page.html',
  styleUrls: ['./hewan.page.scss'],
  standalone: false,
})
export class HewanPage implements OnInit {

  hewanList: any[] = [
    {
      id: '2023001',
      type: 'Sapi Limosin',
      umur: '3 Tahun',
      jk: 'jantan',
      kandang: 'Kandang A-12',
    },
    {
      id: '2023002',
      type: 'Kambing Etawa',
      umur: '2 Tahun',
      jk: 'betina',
      kandang: 'Kandang B-05',
    },
    {
      id: '2023003',
      type: 'Ayam Kampung',
      umur: '1 Tahun',
      jk: 'jantan',
      kandang: 'Kandang C-20',
    },
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
      header: "Pilih Kelompok Hewan",
      buttons: [
        {
          text: 'Kesayangan',
          icon: 'heart-outline',
          handler: () => {
            console.log('Kesayangan dipilih');
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'kesayangan' }
            });
          },
        },
        {
          text: 'Ruminansia',
          icon: 'paw-outline',
          handler: () => {
            console.log('Ruminansia dipilih');
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'ruminansia' }
            });
          },
        },
        {
          text: 'Unggas',
          icon: 'egg-outline',
          handler: () => {
            console.log('Unggas dipilih');
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'unggas' }
            });
          },
        },
        {
          text: 'Primata',
          icon: 'people-outline',
          handler: () => {
            console.log('Primata dipilih');
            this.router.navigate(['/petugas/data-hewan'], {
              queryParams: { kategori: 'primata' }
            });
          }
        },
        {
          text: 'Lainnya',
          icon: 'help-circle-outline',
          handler: () => {
            console.log('Lainnya dipilih');
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