import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-detail-mutasi',
  templateUrl: './detail-mutasi.page.html',
  styleUrls: ['./detail-mutasi.page.scss'],
  standalone: false,
})
export class DetailMutasiPage implements OnInit {

  currentTab = "informasi";

  hewan = {
    kelompokHewan: 'kesayangan',
    jenisHewan: 'Kucing',
    ras: 'Persia',
    idHewan: 'KH-001',
    umur: '2 tahun',
    beratBadan: '4 kg',

  };

  mutasi = {
    jenisMutasi: 'Mati',
    tanggalMutasi: '2024-06-15',
    keterangan: 'Hewan mengalami sakit parah sebelum meninggal.',
    alasanMutasi: 'Sakit',
  };

  // waktu = {
  //   waktuKejadian  : '2024-06-14 10:30 AM',
  // };
    

  constructor() { }

  ngOnInit() {
  }

  onTabChage (tab:string) {
    this.currentTab = tab;
  }

}
