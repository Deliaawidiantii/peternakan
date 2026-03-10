import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';

@Component({
  selector: 'app-mutasi-pindah',
  templateUrl: './mutasi-pindah.page.html',
  styleUrls: ['./mutasi-pindah.page.scss'],
  standalone: false,
})
export class MutasiPindahPage implements OnInit {
  peternakList: any[] = [];
  populasiList: any[] = [];

  idHewan: string = '';
  kelompokHewan: string = '';
  jenisHewan: string = '';
  ras: string = '';
  umur: string = '';
  beratBadan: string = '';
  tanggalPindah: string = '';
  alamatAsal: string = '';
  latitudeAsal: number | null = null;
  longitudeAsal: number | null = null;
  alamatTujuan: string = '';
  latitudeTujuan: number | null = null;
  longitudeTujuan: number | null = null;
  deskripsi: string = '';
  peternakan_id: string = '';
  populasi_id: string = '';

  constructor(
    private navCtrl: NavController,
    private populasiService: PopulasiService,
    private peternakService: PeternakService,
  ) {}

  ngOnInit() {
    this.loadDataMaster();
  }

  loadDataMaster() {
    this.peternakService.getAll().subscribe((res: any) => {
      if (res.success || res.status === 'success') {
        this.peternakList = res.data || [];
      } else if (Array.isArray(res)) {
        this.peternakList = res;
      } else {
        this.peternakList = res?.data || [];
      }
    });
  }

  onPemilikChange(event: any) {
    const selectedId = event.detail.value;
    if (!selectedId) return;
    const peternak = this.peternakList.find((p) => p.id == selectedId);
    if (peternak) {
      this.peternakan_id = peternak.id;
      this.populasiList = [];
      this.populasiService
        .getPopulasi({ peternakan_id: peternak.id })
        .subscribe((res: any) => {
          if (res.success && res.data) {
            this.populasiList = res.data;
          } else if (Array.isArray(res)) {
            this.populasiList = res;
          } else {
            this.populasiList = res?.data || [];
          }
        });
    }
  }

  onHewanChange(event: any) {
    const selectedId = event.detail.value;
    if (!selectedId) return;
    const hewan = this.populasiList.find((h) => h.id == selectedId);
    if (hewan) {
      this.populasi_id = hewan.id;
      this.idHewan = hewan.code || '';
      this.kelompokHewan = hewan.kategori || '';
      this.jenisHewan = hewan.jenis_hewan || '';
      this.ras = hewan.jenis_hewan || '';
      this.umur = hewan.umur || '';
      this.beratBadan = '';
    }
  }

  simpanData() {
    // validasi data wajib diisi
    if (!this.idHewan || !this.tanggalPindah) {
      alert('Mohon lengkapi semua data yang diperlukan.');
      return;
    }

    // validasi lokasi asal
    if (!this.alamatAsal && (!this.latitudeAsal || !this.longitudeAsal)) {
      alert('Mohon isi alamat asal atau  dapatkan koordinat asal');
      return;
    }

    // validasi lokasi tujuan
    if (!this.alamatTujuan && (!this.latitudeTujuan || !this.longitudeTujuan)) {
      alert('Mohon isi alamat tujuan atau dapatkan koordinat tujuan');
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
        koordinat:
          this.latitudeAsal && this.longitudeAsal
            ? `${this.latitudeAsal}, ${this.longitudeAsal}`
            : null,
      },
      lokasiTujuan: {
        alamat: this.alamatTujuan,
        latitude: this.latitudeTujuan,
        longitude: this.longitudeTujuan,
        koordinat:
          this.latitudeTujuan && this.longitudeTujuan
            ? `${this.latitudeTujuan}, ${this.longitudeTujuan}`
            : null,
      },
      deskripsi: this.deskripsi,
    };

    console.log('Data disimpan:', dataPindah);

    alert('Data mutasi pindah hewan berhasil disimpan.');
    this.navCtrl.navigateBack('/petugas/mutasi');
  }

  getLokasiAsal() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitudeAsal = position.coords.latitude;
          this.longitudeAsal = position.coords.longitude;
          console.log(
            'Lokasi asal berhasil diambil:',
            this.latitudeAsal,
            this.longitudeAsal,
          );
          alert(
            'Lokasi Asal berhasil diambil!\nLatitude:  ${this.latitudeAsal} \nLongitude:  ${this.longitudeAsal}',
          );
        },
        (error) => {
          console.error('Gagal mendapatkan lokasi asal:', error);
          alert(
            'Tidak bisa mengambil lokasi asal. Pastikan GPS aktif dan izin diberikan.',
          );
        },
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
          console.log(
            'Lokasi tujuan berhasil diambil:',
            this.latitudeTujuan,
            this.longitudeTujuan,
          );
          alert(
            'Lokasi Tujuan berhasil diambil!\nLatitude:  ${this.latitudeTujuan} \nLongitude:  ${this.longitudeTujuan}',
          );
        },
        (error) => {
          console.error('Gagal mendapatkan lokasi tujuan:', error);
          alert(
            'Tidak bisa mengambil lokasi tujuan. Pastikan GPS aktif dan izin diberikan.',
          );
        },
      );
    } else {
      alert('Browser tidak mendukung fitur lokasi.');
    }
  }
}
