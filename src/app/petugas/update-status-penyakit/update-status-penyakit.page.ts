import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-status-penyakit',
  templateUrl: './update-status-penyakit.page.html',
  styleUrls: ['./update-status-penyakit.page.scss'],
  standalone: false,
})
export class UpdateStatusPenyakitPage {


  constructor(private alertController: AlertController) { }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Berhasil!',
      message: 'Data telah disimpan dengan sukses',
      buttons: ['OK'],
      cssClass : 'custom-alert'

    });
    await alert.present();
  }

  // ngOnInit() {
  // }

}
