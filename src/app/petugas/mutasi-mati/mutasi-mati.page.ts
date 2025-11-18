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
  penyebabLainnya: string = "";
  deskripsi: string = "";

  constructor(private navCtrl : NavController){ }

  simpanData() {
    // validasi ID hewan , tgl, dan penyebab Kematian
    if(!this.idHewan || !this.tanggalKematian || !this.penyebabKematian) {
      alert("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    // penyebab kematian lainnya
    if(this.penyebabKematian=== "Lainnya" && !this.penyebabLainnya) {
      alert("Mohon sebutkan penyebab kematian.");
      return;
    }

    // tentukan penyebab final yang akan disimbpan
    const penyebabFinal = this.penyebabKematian === "Lainnya" ? this.penyebabLainnya : this.penyebabKematian;

    // siapkan data untuk disimnpan
    const dataKematian = {
      idHewan: this.idHewan,
      tanggalKematian: this.tanggalKematian,
      penyebabKematian: penyebabFinal,
      deskripsi: this.deskripsi
    };

    console.log("Data Kematian Disimpan:", dataKematian);


    alert("Data kematian hewan berhasil disimpan.");
    this.navCtrl.navigateBack('/mutasi');

    
    // this.navCtrl.navigateBack('/mutasi');
  }

  ngOnInit() {
  }

}
