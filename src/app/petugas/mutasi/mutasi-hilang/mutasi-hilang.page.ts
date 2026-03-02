import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopulasiService } from '../../../../services/populasi.service';
import { PeternakService } from '../../../../services/peternak.service';

@Component({
  selector: 'app-mutasi-hilang',
  templateUrl: './mutasi-hilang.page.html',
  styleUrls: ['./mutasi-hilang.page.scss'],
  standalone: false,
})
export class MutasiHilangPage implements OnInit {
  peternakList: any[] = [];
  populasiList: any[] = [];

  idHewan: string = '';
  kelompokHewan: string = '';
  jenisHewan: string = '';
  ras: string = '';
  umur: string = '';
  beratBadan: string = '';
  tanggalHilang: string = '';
  lokasiTerakhir: string = '';
  deskripsi: string = '';
  latitude: number | null = null;
  longitude: number | null = null;
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
    if (!this.idHewan || !this.tanggalHilang) {
      alert('Mohon lengkapi semua data yang diperlukan.');
      return;
    }

    console.log('Data disimpan:', {
      idHewan: this.idHewan,
      populasi_id: this.populasi_id,
      peternakan_id: this.peternakan_id,
      tanggalHilang: this.tanggalHilang,
      latitude: this.latitude,
      longitude: this.longitude,
      deskripsi: this.deskripsi,
    });

    alert('Data mutasi hilang hewan berhasil disimpan.');
    this.navCtrl.navigateBack('/petugas/mutasi');
  }

  getLokasi() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.lokasiTerakhir = `${this.latitude}, ${this.longitude}`;
          alert(
            `Lokasi berhasil diambil!\nLatitude: ${this.latitude}\nLongitude: ${this.longitude}`,
          );
        },
        (error) => {
          console.error('Gagal mendapatkan lokasi:', error);
          alert(
            'Tidak bisa mengambil lokasi. Pastikan GPS aktif dan izin diberikan.',
          );
        },
      );
    } else {
      alert('Browser tidak mendukung fitur lokasi.');
    }
  }
}
