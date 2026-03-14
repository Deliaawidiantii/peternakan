import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { MutasiService } from '../../services/mutasi.service';

@Component({
  selector: 'app-mutasi',
  standalone: false,
  templateUrl: './mutasi.page.html',
  styleUrls: ['./mutasi.page.scss'],
})
export class MutasiPage implements OnInit {
  months: string[] = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  selectedMonth = '';
  selectedType = '';
  isLoading = false;

  mutasiList: any[] = [];
  filteredMutasi: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private mutasiService: MutasiService,
  ) {}

  ngOnInit() {
    this.loadMutasi();
  }

  ionViewWillEnter() {
    this.loadMutasi();
  }

  loadMutasi() {
    this.isLoading = true;

    this.mutasiService.getMutasi().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        this.mutasiList = data.map((item: any) => ({
          ...item,
          displayId: item?.populasi?.code || `#${item?.populasi_id ?? item?.id}`,
          displayJenis: this.formatJenis(item?.jenis_mutasi),
          displayTanggal: this.formatTanggal(item?.tanggal),
          monthName: this.getMonthName(item?.tanggal),
        }));

        this.filterData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Gagal memuat data mutasi:', err);
        this.mutasiList = [];
        this.filteredMutasi = [];
        this.isLoading = false;
      },
    });
  }

  filterData() {
    this.filteredMutasi = this.mutasiList.filter((item) => {
      const cocokBulan = this.selectedMonth
        ? item.monthName === this.selectedMonth
        : true;

      const cocokJenis = this.selectedType
        ? item.jenis_mutasi === this.selectedType
        : true;

      return cocokBulan && cocokJenis;
    });
  }

  goToDetail(id: number) {
    this.navCtrl.navigateForward(['/petugas/detail-mutasi'], {
      queryParams: { id },
    });
  }

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
            this.goToFormMutasi(value);
          },
        },
      ],
    });

    await alert.present();
  }

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

  private formatJenis(jenis: string | null | undefined): string {
    switch (jenis) {
      case 'mati':
        return 'Mati';
      case 'hilang':
        return 'Hilang';
      case 'dipotong':
        return 'Dipotong';
      case 'dijual':
        return 'Dijual';
      case 'pindah':
        return 'Dipindahkan';
      default:
        return jenis || '-';
    }
  }

  private formatTanggal(tanggal: string | null | undefined): string {
    if (!tanggal) {
      return '-';
    }

    const date = new Date(tanggal);
    if (Number.isNaN(date.getTime())) {
      return tanggal;
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private getMonthName(tanggal: string | null | undefined): string {
    if (!tanggal) {
      return '';
    }

    const date = new Date(tanggal);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return this.months[date.getMonth()] || '';
  }
}
