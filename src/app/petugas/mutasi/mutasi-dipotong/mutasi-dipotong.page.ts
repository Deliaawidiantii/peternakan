import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopulasiService } from '../../../services/populasi.service';
import { PeternakService } from '../../../services/peternak.service';

@Component({
  selector: 'app-mutasi-dipotong',
  templateUrl: './mutasi-dipotong.page.html',
  styleUrls: ['./mutasi-dipotong.page.scss'],
  standalone: false,
})
export class MutasiDipotongPage implements OnInit {
  peternakList: any[] = [];
  populasiList: any[] = [];

  idHewan: string = '';
  kelompokHewan: string = '';
  jenisHewan: string = '';
  ras: string = '';
  umur: string = '';
  beratBadan: string = '';
  tanggalPemotongan: string = '';
  alasanPemotongan: string = '';
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
    if (!this.idHewan || !this.tanggalPemotongan || !this.alasanPemotongan) {
      alert('Mohon lengkapi semua data yang diperlukan.');
      return;
    }

    console.log('Data disimpan:', {
      idHewan: this.idHewan,
      populasi_id: this.populasi_id,
      peternakan_id: this.peternakan_id,
      tanggalPemotongan: this.tanggalPemotongan,
      alasanPemotongan: this.alasanPemotongan,
      deskripsi: this.deskripsi,
    });

    alert('Data pemotongan hewan berhasil disimpan.');
    this.navCtrl.navigateBack('/petugas/mutasi');
  }
}
