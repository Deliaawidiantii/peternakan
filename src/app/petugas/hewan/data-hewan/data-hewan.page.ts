import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-data-hewan',
  templateUrl: './data-hewan.page.html',
  styleUrls: ['./data-hewan.page.scss'],
  standalone: false,
})
export class DataHewanPage implements OnInit {
  selectedKategori: string = '';

  formData: any = {
    idKandang: '',
    idPemilik: '',
    desa: '',
    jenisHewan: '',
    jenisHewanLainnya: '', // untuk input custom jika pilih "Lainnya"
    jenisKelamin: '',
  };

  jenisHewanOptions: any[] = [];
  currentFormFields: any[] = [];

  kategoriMapping: any = {
    kesayangan: {
      label: 'Hewan Kesayangan',
      jenisHewan: [
        { label: 'Anjing', value: 'anjing' },
        { label: 'Kucing', value: 'kucing' },
        { label: 'Kelinci', value: 'kelinci' },
        { label: 'Burung', value: 'burung' },
        { label: 'Reptil', value: 'reptil' },
      ],
      fields: [
        {
          name: 'warna',
          label: 'Warna',
          type: 'text',
          placeholder: 'Masukkan warna hewan',
        },
        {
          name: 'ukuran',
          label: 'Ukuran',
          type: 'select',
          placeholder: 'Pilih ukuran',
          options: [
            { label: 'Kecil', value: 'kecil' },
            { label: 'Sedang', value: 'sedang' },
            { label: 'Besar', value: 'besar' },
          ],
        },
        {
          name: 'vaksinasi',
          label: 'Status Vaksinasi',
          type: 'select',
          placeholder: 'Pilih status',
          options: [
            { label: 'Sudah', value: 'sudah' },
            { label: 'Belum', value: 'belum' },
          ],
        },
      ],
    },
    ruminansia: {
      label: 'Hewan Ruminansia',
      jenisHewan: [
        { label: 'Sapi', value: 'sapi' },
        { label: 'Kambing', value: 'kambing' },
        { label: 'Domba', value: 'domba' },
        { label: 'Kerbau', value: 'kerbau' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'tinggiPunuk',
          label: 'Tinggi Punuk (cm)',
          type: 'number',
          placeholder: 'Masukkan tinggi punuk',
        },
        {
          name: 'asal',
          label: 'Asal/Ras',
          type: 'text',
          placeholder: 'Contoh: Limosin, Brahman',
        },
        {
          name: 'statusReproduksi',
          label: 'Status Reproduksi',
          type: 'select',
          placeholder: 'Pilih status',
          options: [
            { label: 'Induk', value: 'induk' },
            { label: 'Lepas Sapih', value: 'lepas_sapih' },
            { label: 'Dara/Muda', value: 'muda' },
          ],
        },
      ],
    },
    unggas: {
      label: 'Hewan Unggas',
      jenisHewan: [
        { label: 'Ayam', value: 'ayam' },
        { label: 'Itik', value: 'itik' },
        { label: 'Angsa', value: 'angsa' },
        { label: 'Kalkun', value: 'kalkun' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'produksi',
          label: 'Jenis Produksi',
          type: 'select',
          placeholder: 'Pilih produksi',
          options: [
            { label: 'Daging', value: 'daging' },
            { label: 'Telur', value: 'telur' },
            { label: 'Dwiguna', value: 'dwiguna' },
          ],
        },
        {
          name: 'asal',
          label: 'Ras/Jenis',
          type: 'text',
          placeholder: 'Contoh: Ayam Kampung, Broiler',
        },
      ],
    },
    primata: {
      label: 'Hewan Primata',
      jenisHewan: [
        { label: 'Monyet', value: 'monyet' },
        { label: 'Kera', value: 'kera' },
        { label: 'Gibbon', value: 'gibbon' },
        { label: 'Lemur', value: 'lemur' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'warna',
          label: 'Warna Bulu',
          type: 'text',
          placeholder: 'Masukkan warna bulu',
        },
        {
          name: 'habitat',
          label: 'Habitat Asal',
          type: 'text',
          placeholder: 'Masukkan habitat asal',
        },
      ],
    },
    lainnya: {
      label: 'Hewan Lainnya',
      jenisHewan: [
        { label: 'Babi', value: 'babi' },
        { label: 'Rusa', value: 'rusa' },
        { label: 'Trenggiling', value: 'trenggiling' },
        { label: 'Lainnya', value: 'lainnya_spesifik' },
      ],
      fields: [
        {
          name: 'beratBadan',
          label: 'Berat Badan (kg)',
          type: 'number',
          placeholder: 'Masukkan berat badan',
        },
        {
          name: 'keterangan',
          label: 'Keterangan Khusus',
          type: 'text',
          placeholder: 'Masukkan informasi tambahan',
        },
      ],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Baca kategori dari query params
    this.route.queryParams.subscribe((params) => {
      if (params['kategori']) {
        this.selectedKategori = params['kategori'];
        this.updateFormFields();
      }
    });
  }

  updateFormFields() {
    if (
      this.selectedKategori &&
      this.kategoriMapping[this.selectedKategori]
    ) {
      const mapping = this.kategoriMapping[this.selectedKategori];
      this.jenisHewanOptions = mapping.jenisHewan;
      this.currentFormFields = mapping.fields;
    }
  }

  async pilihKategoriUlang() {
    const buttons: any[] = Object.keys(this.kategoriMapping).map((key) => ({
      text: this.kategoriMapping[key].label,
      handler: () => {
        this.selectedKategori = key;
        this.updateFormFields();
        this.resetForm();
      },
    }));

    buttons.push({
      text: 'Batal',
      role: 'cancel' as any,
    });

    const alert = await this.alertController.create({
      header: 'Pilih Kelompok Hewan',
      buttons: buttons as any,
    });

    await alert.present();
  }

  resetForm() {
    this.formData = {
      idKandang: '',
      idPemilik: '',
      desa: '',
      jenisHewan: '',
      jenisHewanLainnya: '',
      jenisKelamin: '',
    };
  }

  async simpanData() {
    if (!this.formData.jenisHewan || !this.formData.jenisKelamin || !this.formData.desa) {
      const alert = await this.alertController.create({
        header: 'Data Tidak Lengkap',
        message: 'Silakan isi semua field yang wajib!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    console.log('Data yang disimpan:', this.formData);
    console.log('Kategori:', this.selectedKategori);

    // Simulasi simpan data - ganti dengan API call sesuai kebutuhan
    const alert = await this.alertController.create({
      header: 'Berhasil!',
      message: 'Data hewan berhasil disimpan!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Kembali ke halaman hewan setelah simpan
            this.router.navigate(['/petugas/hewan']);
          },
        },
      ],
    });

    await alert.present();
  }

  batal() {
    this.router.navigate(['/petugas/hewan']);
  }
}