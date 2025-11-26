import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mutasi',
  standalone: false,
  templateUrl: './mutasi.page.html',
  styleUrls: ['./mutasi.page.scss'],
})
export class MutasiPage implements OnInit {

  months: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  selectedMonth: string = '';
  selectedType: string = '';

  mutasiList = [
    { id: '20240512001', jenis: 'Mati', tanggal: '12 Mei 2024' },
    { id: '20240510002', jenis: 'Hilang', tanggal: '10 Mei 2024' },
    { id: '20240508003', jenis: 'Dipotong', tanggal: '8 Mei 2024' },
    { id: '20240505004', jenis: 'Dijual', tanggal: '5 Mei 2024' },
    { id: '20240503005', jenis: 'Dipindahkan', tanggal: '3 Mei 2024' },
  ];

  filteredMutasi = [...this.mutasiList];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.filterData();
  }

  filterData() {
    this.filteredMutasi = this.mutasiList.filter(item => {
      const cocokBulan = this.selectedMonth
        ? item.tanggal.includes(this.selectedMonth)
        : true;

      const cocokJenis = this.selectedType
        ? item.jenis === this.selectedType
        : true;

      return cocokBulan && cocokJenis;
    });
  }

 goToDetail(id: string, jenis: string, tanggal: string) {
  this.navCtrl.navigateForward('/petugas/detail-mutasi');
}


  //              MODAL UNTUK PILIH MUTASI

  async tambahMutasi() {
    const alert = await this.alertCtrl.create({
      header: 'Pilih Jenis Mutasi',
      inputs: [
        { label: 'Mati', type: 'radio', value: 'Mati' },
        { label: 'Hilang', type: 'radio', value: 'Hilang' },
        { label: 'Dipotong', type: 'radio', value: 'Dipotong' },
        { label: 'Dijual', type: 'radio', value: 'Dijual' },
        { label: 'Dipindahkan', type: 'radio', value: 'Dipindahkan' },
      ],
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Pilih',
          handler: (value) => {
            console.log('Mutasi dipilih:', value);
            this.goToFormMutasi(value);
          },
        },
      ],
    });

    await alert.present();
  }


  //          ROUTE BERBEDA UNTUK SETIAP MUTASI

  goToFormMutasi(jenis: string) {
    switch (jenis) {
      case 'Mati':
        this.navCtrl.navigateForward('/petugas/mutasi-mati');
        break;

      case 'Hilang':
        this.navCtrl.navigateForward('/petugas/mutasi-hilang');
        break;

      case 'Dipotong':
        this.navCtrl.navigateForward('/petugas/mutasi-dipotong');
        break;

      case 'Dijual':
        this.navCtrl.navigateForward('/petugas/mutasidijual');
        break;

      case 'Dipindahkan':
        this.navCtrl.navigateForward('/petugas/mutasi-pindah');
        break;

      default:
        console.warn('Jenis mutasi tidak dikenali:', jenis);
    }
  }
}
