import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-mutasi-mati',
  templateUrl: './mutasi-mati.page.html',
  styleUrls: ['./mutasi-mati.page.scss'],
  standalone: false,
})
export class MutasiMatiPage {

  idHewan: string = "";
  tanggalKematian: string = "";
  penyebabKematian: string = "";
  deskripsi: string = "";

  constructor(private navCtrl : NavController){ }

  simpanData() {
    if(!this.idHewan || !this.tanggalKematian || !this.penyebabKematian) {
      alert("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    
    this.navCtrl.navigateBack('/mutasi');
  }

  ngOnInit() {
  }

}
