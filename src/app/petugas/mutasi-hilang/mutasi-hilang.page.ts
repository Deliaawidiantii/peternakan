import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mutasi-hilang',
  templateUrl: './mutasi-hilang.page.html',
  styleUrls: ['./mutasi-hilang.page.scss'],
  standalone: false,
})
export class MutasiHilangPage {
  idHewan: string = "";
  tanggalHilang: string = "";
  lokasiTerakhir: string = "";
  deskripsi: string = "";
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(private navCtrl: NavController) {}

  simpanData() {

    // validasi data wajib diisi

    if (!this.idHewan || !this.tanggalHilang || !this.lokasiTerakhir) {
      alert("Mohon lengkapi semua data yang diperlukan.");
      return;
    }

    // siapkan data untuk disimpan
    console.log("Data disimpan:", {
      idHewan: this.idHewan,
      tanggalHilang: this.tanggalHilang,
      latitude: this.latitude,
      longitude: this.longitude,
      deskripsi: this.deskripsi,
      koordinat: this.latitude && this.longitude ? `${this.latitude}, ${this.longitude}` : 'Tidak ada data lokasi'
    });

    // Kembali ke halaman mutasi
    alert("Data mutasi hilang hewan berhasil disimpan.");
    this.navCtrl.navigateBack('/mutasi');
  }

  getLokasi() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.lokasiTerakhir = `${this.latitude}, ${this.longitude}`;
          console.log('Lokasi berhasil diambil:', this.latitude, this.longitude);
          alert(`Lokasi berhasil diambil!\nLatitude: ${this.latitude}\nLongitude: ${this.longitude}`);
        },
        (error) => {
          console.error('Gagal mendapatkan lokasi:', error);
          alert('Tidak bisa mengambil lokasi. Pastikan GPS aktif dan izin diberikan.');
        }
      );
    } else {
      alert('Browser tidak mendukung fitur lokasi.');
    }
  }
}
