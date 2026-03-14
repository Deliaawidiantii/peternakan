import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { MutasiService } from '../../../services/mutasi.service';

@Component({
  selector: 'app-detail-mutasi',
  templateUrl: './detail-mutasi.page.html',
  styleUrls: ['./detail-mutasi.page.scss'],
  standalone: false,
})
export class DetailMutasiPage implements OnInit {
  currentTab = 'informasi';
  mutasiId: number | null = null;
  isLoading = true;

  hewan = {
    kelompokHewan: '-',
    jenisHewan: '-',
    ras: '-',
    idHewan: '-',
    umur: '-',
    beratBadan: '-',
  };

  mutasi = {
    jenisMutasi: '-',
    tanggalMutasi: '-',
    keterangan: '-',
    alasanMutasi: '-',
  };

  constructor(
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private mutasiService: MutasiService,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!id) {
        this.isLoading = false;
        this.showToast('ID mutasi tidak ditemukan', 'warning');
        this.router.navigate(['/petugas/mutasi']);
        return;
      }

      this.mutasiId = id;
      this.loadMutasiDetail(id);
    });
  }

  onTabChange(tab: string) {
    this.currentTab = tab;
  }

  async deleteMutasi() {
    if (!this.mutasiId) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Hapus Mutasi',
      message: 'Apakah Anda yakin ingin menghapus data mutasi ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.mutasiService.deleteMutasi(this.mutasiId as number).subscribe({
              next: async () => {
                await this.showToast('Data mutasi berhasil dihapus', 'success');
                this.router.navigate(['/petugas/mutasi']);
              },
              error: async (err) => {
                await this.showToast(
                  err?.error?.message || 'Gagal menghapus data mutasi',
                  'danger',
                );
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async editMutasi() {
    await this.showToast('Fitur edit mutasi belum tersedia.', 'warning');
  }

  private loadMutasiDetail(id: number) {
    this.isLoading = true;

    this.mutasiService.getMutasiById(id).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res ?? {};
        const populasi = data?.populasi ?? {};

        this.hewan = {
          kelompokHewan: populasi?.kategori || '-',
          jenisHewan: populasi?.jenis_hewan || '-',
          ras: populasi?.ras || '-',
          idHewan: populasi?.code || '-',
          umur: populasi?.umur ? `${populasi.umur} bulan` : '-',
          beratBadan: populasi?.berat_badan ? `${populasi.berat_badan} kg` : '-',
        };

        this.mutasi = {
          jenisMutasi: this.formatJenis(data?.jenis_mutasi),
          tanggalMutasi: this.formatTanggal(data?.tanggal),
          alasanMutasi:
            data?.penyebab ||
            data?.tujuan_potong ||
            data?.nama_pembeli ||
            data?.lokasi_terakhir ||
            '-',
          keterangan: this.buildKeterangan(data),
        };

        this.isLoading = false;
      },
      error: async (err) => {
        this.isLoading = false;
        await this.showToast(
          err?.error?.message || 'Gagal memuat detail mutasi',
          'danger',
        );
        this.router.navigate(['/petugas/mutasi']);
      },
    });
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

  private buildKeterangan(data: any): string {
    const parts = [
      data?.deskripsi,
      data?.lokasi_asal ? `Asal: ${data.lokasi_asal}` : null,
      data?.lokasi_tujuan ? `Tujuan: ${data.lokasi_tujuan}` : null,
      data?.harga_jual ? `Harga jual: Rp ${data.harga_jual}` : null,
      data?.berat_daging ? `Berat daging: ${data.berat_daging} kg` : null,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' | ') : '-';
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'success',
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });

    await toast.present();
  }
}
