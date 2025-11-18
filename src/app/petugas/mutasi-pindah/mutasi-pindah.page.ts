import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-mutasi-pindah',
  templateUrl: './mutasi-pindah.page.html',
  styleUrls: ['./mutasi-pindah.page.scss'],
  standalone: false,
})
export class MutasiPindahPage  {

  idHewan: string = "";
  tanggalPindah: string = "";
  alamatAsal: string = "";
  latitudeAsal: number | null = null;
  longitudeAsal: number | null = null;
  alamatTujuan: string = "";
  latitudeTujuan: number | null = null;
  longitudeTujuan: number | null = null;
  deskripsi: string = "";

  constructor(private navCtrl: NavController) {}
  
    simpanData() {
      // validasi data wajib diisi
      if (!this.idHewan || !this.tanggalPindah ) {
        alert("Mohon lengkapi semua data yang diperlukan.");
        return;
      }

      // validasi lokasi asal 
      if (!this.alamatAsal && (!this.latitudeAsal || !this.longitudeAsal )) {
        alert("Mohon isi alamat asal atau  dapatkan koordinat asal");
        return;
      }

      // validasi lokasi tujuan
      if(!this.alamatTujuan && (!this.latitudeTujuan || !this.longitudeTujuan )) {
        alert("Mohon isi alamat tujuan atau dapatkan koordinat tujuan");
        return;
      }

      // siapkan data untuk disimpan
  
      const dataPindah = {
      idHewan: this.idHewan,
      tanggalPindah: this.tanggalPindah,
      lokasiAsal: {
        alamat: this.alamatAsal,
        latitude: this.latitudeAsal,
        longitude: this.longitudeAsal,
        koordinat: this.latitudeAsal && this.longitudeAsal 
          ? `${this.latitudeAsal}, ${this.longitudeAsal}` 
          : null
      },
      lokasiTujuan: {
        alamat: this.alamatTujuan,
        latitude: this.latitudeTujuan,
        longitude: this.longitudeTujuan,
        koordinat: this.latitudeTujuan && this.longitudeTujuan 
          ? `${this.latitudeTujuan}, ${this.longitudeTujuan}` 
          : null
      },
      deskripsi: this.deskripsi
    };

    console.log("Data disimpan:", dataPindah);

    alert("Data mutasi pindah hewan berhasil disimpan.");
    this.navCtrl.navigateBack('/petugas/mutasi');
    }

  getLokasiAsal() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitudeAsal = position.coords.latitude;
          this.longitudeAsal = position.coords.longitude;
          console.log('Lokasi asal berhasil diambil:', this.latitudeAsal, this.longitudeAsal);
          alert('Lokasi Asal berhasil diambil!\nLatitude:  ${this.latitudeAsal} \nLongitude:  ${this.longitudeAsal}');
        },  
        (error) => {
          console.error('Gagal mendapatkan lokasi asal:', error);
          alert('Tidak bisa mengambil lokasi asal. Pastikan GPS aktif dan izin diberikan.');
        }
      );
    } else {
      alert('Browser tidak mendukung fitur lokasi.');
    }
  }

  getLokasiTujuan() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitudeTujuan = position.coords.latitude;
          this.longitudeTujuan = position.coords.longitude;
          console.log('Lokasi tujuan berhasil diambil:', this.latitudeTujuan, this.longitudeTujuan);
          alert('Lokasi Tujuan berhasil diambil!\nLatitude:  ${this.latitudeTujuan} \nLongitude:  ${this.longitudeTujuan}');
        },
        (error) => {
          console.error('Gagal mendapatkan lokasi tujuan:', error);
          alert('Tidak bisa mengambil lokasi tujuan. Pastikan GPS aktif dan izin diberikan.');
        }
      );
    } else {
      alert('Browser tidak mendukung fitur lokasi.');
    }
  }
}
  
    
  
  
