import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-daftar-penyakit',
  templateUrl: './daftar-penyakit.page.html',
  styleUrls: ['./daftar-penyakit.page.scss'],
  standalone:  false,
})
export class DaftarPenyakitPage implements OnInit {

  constructor(private alertcontroller: AlertController) { }

  async showAlert(){
    const alert = await this.alertcontroller.create({
      header : 'gagal ',
      message : 'Menunggu Verifikasi ',
      buttons : ['Ok'],
      cssClass:'custom-alert'
    })
    await alert.present();
  }

  ngOnInit() {
  }

}
