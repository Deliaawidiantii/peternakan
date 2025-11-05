import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-mutasi-dipotong',
  templateUrl: './mutasi-dipotong.page.html',
  styleUrls: ['./mutasi-dipotong.page.scss'],
  standalone: false,
})
export class MutasiDipotongPage {

  idHewan: string = "";
  tanggalPemotongan: string = "";
  alasanPemotongan: string = "";
  deskripsi: string = "";

  constructor(private navCtrl: NavController) { }

  simpanData() {
    if(!this.idHewan || !this.tanggalPemotongan || !this.alasanPemotongan) {
      alert("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    this.navCtrl.navigateBack('/mutasi');
  }

  ngOnInit() {
  }

}


