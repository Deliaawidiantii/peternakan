import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PeternakService } from '../../../services/peternak.service';
import { WilayahService } from '../../../services/wilayah.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-pemilik',
  templateUrl: './data-pemilik.page.html',
  styleUrls: ['./data-pemilik.page.scss'],
  standalone: false,
})
export class DataPemilikPage implements OnInit {

  isEditMode: boolean = false;
  peternakId: number | null = null;

  wilayahList: any[] = []; // ✅ DROPDOWN DESA

  form = {
    nik: '',
    nama_peternak: '',
    alamat: '',
    no_telp: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    wilayah_id: '' // ✅ DIISI DARI DROPDOWN
  };

  errors: string[] = [];

  constructor(
    private navCtrl: NavController,
    private peternakService: PeternakService,
    private wilayahService: WilayahService, // ✅ HARUS ADA
    private loadingController: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    // ✅ LOAD DROPDOWN DESA
    this.loadWilayah();

    // ✅ CEK MODE EDIT
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.peternakId = parseInt(id);
      this.loadPeternakData(this.peternakId);
    }
  }

  // ✅ LOAD WILAYAH DARI API
  loadWilayah() {
    this.wilayahService.getWilayah().subscribe(
      (res: any) => {
        if (res.success) {
          this.wilayahList = res.data;
        }
      },
      (err: any) => {
        console.error('Gagal mengambil wilayah:', err);
      }
    );
  }

  // ✅ LOAD DATA PETERNak UNTUK MODE EDIT
  async loadPeternakData(id: number) {
    const loading = await this.loadingController.create({
      message: 'Memuat data...'
    });
    await loading.present();

    this.peternakService.getById(id).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          const data = response.data;
          this.form = {
            nik: data.nik,
            nama_peternak: data.nama_peternak,
            alamat: data.alamat,
            no_telp: data.no_telp,
            tanggal_lahir: data.tanggal_lahir,
            jenis_kelamin: data.jenis_kelamin,
            wilayah_id: data.wilayah_id
          };
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error loading data:', error);

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Gagal memuat data peternak',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  // ✅ SUBMIT DATA
  async onSubmit() {

    this.errors = [];

    // ✅ VALIDASI
    if (!this.form.nik) this.errors.push('NIK harus diisi');
    if (!this.form.nama_peternak) this.errors.push('Nama harus diisi');
    if (!this.form.alamat) this.errors.push('Alamat harus diisi');
    if (!this.form.no_telp) this.errors.push('Nomor HP harus diisi');
    if (!this.form.tanggal_lahir) this.errors.push('Tanggal lahir harus diisi');
    if (!this.form.jenis_kelamin) this.errors.push('Jenis kelamin harus dipilih');
    if (!this.form.wilayah_id) this.errors.push('Desa harus dipilih');

    if (this.errors.length > 0) return;

    const loading = await this.loadingController.create({
      message: this.isEditMode ? 'Mengupdate data...' : 'Menyimpan data...',
      spinner: 'crescent'
    });
    await loading.present();

    const apiCall = this.isEditMode
      ? this.peternakService.update(this.peternakId!, this.form)
      : this.peternakService.create(this.form);

    apiCall.subscribe({
      next: async (response) => {
        await loading.dismiss();

        if (response.success) {
          const alert = await this.alertController.create({
            header: 'Berhasil',
            message: response.message || (this.isEditMode ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan'),
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.navigateBack('/petugas/pemilik');
                }
              }
            ]
          });
          await alert.present();
        } else {
          this.errors.push(response.message || 'Terjadi kesalahan');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Submit error:', error);

        this.errors = [];

        if (error.status === 422 && error.error?.errors) {
          const serverErrors = error.error.errors;
          Object.keys(serverErrors).forEach(key => {
            serverErrors[key].forEach((msg: string) => {
              if (msg.includes('required')) this.errors.push(`${key} wajib diisi`);
              else if (msg.includes('unique')) this.errors.push(`${key} sudah digunakan`);
              else this.errors.push(msg);
            });
          });
        } else if (error.status === 401) {
          this.errors.push('Sesi login berakhir. Silakan login ulang.');
          setTimeout(() => this.navCtrl.navigateRoot('/login'), 1500);
        } else if (error.status === 0) {
          this.errors.push('Tidak dapat terhubung ke server');
        } else {
          this.errors.push('Gagal menyimpan data');
        }
      }
    });
  }

  compareWilayah(w1: any, w2: any) {
    return w1 && w2 ? w1 === w2 : w1 === w2;
  }

  goBack() {
    this.navCtrl.back();
  }
}
