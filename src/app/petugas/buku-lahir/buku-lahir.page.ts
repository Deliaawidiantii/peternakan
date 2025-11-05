import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buku-lahir',
  templateUrl: './buku-lahir.page.html',
  styleUrls: ['./buku-lahir.page.scss'],
  standalone: false,
})
export class BukuLahirPage  {

  kelompokHewan: string = "";

  constructor( private actionSheetController : ActionSheetController, private router : Router) { }


  async pilihKelompokHewan() {
    const actionSheet = await this.actionSheetController.create({
    header: "Pilih Kelompok Hewan",
    buttons:[
      {
        text: 'Ruminansia',
        icon: 'paw-outline',
        handler: () => {
          console.log('Ruminansia dipilih');
          this.kelompokHewan = 'Ruminansia';
          this.router.navigate(['/petugas/ruminansia']);
        },
      },

      {
        text: 'Unggas',
        icon: 'egg-outline',
        handler: () => {
          console.log('Unggas dipilih');
          this.kelompokHewan = 'Unggas';
          this.router.navigate(['/petugas/unggas']);

        },
      },

      {
        text : 'Primata',
        icon : 'people-outline',
        handler : () => {
          console.log('Primata dipilih');
          this.kelompokHewan = 'Primata';
          this.router.navigate(['/petugas/primata']);

        }
      },

      {
        text: 'Kesayangan',
        icon: 'heart-outline',
        handler: () => {
          console.log('Kesayangan dipilih');
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

    await actionSheet.present()


  // ngOnInit() {
  // }

}
}
