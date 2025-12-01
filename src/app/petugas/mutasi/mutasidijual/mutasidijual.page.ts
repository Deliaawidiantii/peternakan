import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-mutasidijual',
  templateUrl: './mutasidijual.page.html',
  styleUrls: ['./mutasidijual.page.scss'],
  standalone: false,
})
export class MutasidijualPage  {
  idHewan: string = "";
  tanggalPenjualan: string = "";
  namaPembeli: string = "";
  hargaJual: number | null = null;
  deskripsi: string = "";

  constructor(private navCtrl : NavController) { }

  simpanData() {
    if(!this.idHewan || !this.tanggalPenjualan || !this.namaPembeli || this.hargaJual === null) {
      alert("Mohon lengkapi semua data yang diperlukan.");
      return;
    }
    this.navCtrl.navigateBack('/mutasi');
  }

  ngOnInit() {
  }

}
