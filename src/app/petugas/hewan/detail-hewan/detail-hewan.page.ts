import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { KandangService } from '../../../services/kandang.service';

@Component({
  selector: 'app-detail-hewan',
  templateUrl: './detail-hewan.page.html',
  styleUrls: ['./detail-hewan.page.scss'],
  standalone: false,
})
export class DetailHewanPage implements OnInit {
  hewan: any = {};
  kandang: any = null;
  isLoading = true;
  barcodeId = '';
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private kandangService: KandangService,
    private toastController: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadDetail(id);
      return;
    }

    this.showToast('ID hewan tidak ditemukan', 'danger');
    this.router.navigate(['/petugas/hewan']);
  }

  loadDetail(id: string) {
    this.isLoading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoading = false;
      this.showToast('Sesi Anda telah berakhir', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http.get(`${this.apiUrl}/populasi/${id}`, { headers }).subscribe({
      next: (res: any) => {
        this.hewan = res.data ?? res ?? {};
        this.kandang = this.normalizeKandang(this.hewan?.kandang);

        if (!this.hewan || Object.keys(this.hewan).length === 0) {
          this.isLoading = false;
          this.showToast('Data hewan tidak ditemukan', 'warning');
          this.router.navigate(['/petugas/hewan']);
          return;
        }

        if (!this.kandang && this.hewan?.kandang_id) {
          this.loadKandangDetail(Number(this.hewan.kandang_id));
        }

        if (this.hewan.qr_code) {
          this.barcodeId = `${this.apiUrl.replace('/api', '')}/storage/${this.hewan.qr_code}`;
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.showToast('Sesi Anda telah berakhir', 'warning');
          this.router.navigate(['/login']);
          return;
        }

        if (err.status === 404) {
          this.showToast('Data hewan tidak ditemukan', 'danger');
          this.router.navigate(['/petugas/hewan']);
          return;
        }

        const errorMsg = err.error?.message || 'Gagal memuat detail';
        this.showToast(errorMsg, 'danger');
      },
    });
  }

  viewBarcode() {
    this.showToast('Menampilkan barcode: ' + this.barcodeId, 'primary');
  }

  hasKandangInfo(): boolean {
    return !!this.getKandangInfo() || !!this.hewan?.kandang_id;
  }

  formatKandangId(): string {
    const kandang = this.getKandangInfo();

    if (!kandang && this.hewan?.kandang_id) {
      return `KNDG${String(this.hewan.kandang_id).padStart(3, '0')}`;
    }

    if (!kandang) {
      return '-';
    }

    if (kandang.id_kandang) return kandang.id_kandang;
    if (kandang.code) return kandang.code;
    if (kandang.id) return `KNDG${String(kandang.id).padStart(3, '0')}`;
    return '-';
  }

  getNamaKandang(): string {
    return this.getKandangInfo()?.nama_kandang || '-';
  }

  getStatusKandang(): string {
    return this.getKandangInfo()?.status_kandang || '-';
  }

  getLokasiKandang(): string {
    const kandang = this.getKandangInfo();
    return (
      kandang?.alamat ||
      kandang?.lokasi ||
      kandang?.wilayah?.nama_desa ||
      this.hewan?.wilayah?.nama_desa ||
      '-'
    );
  }

  getKoordinatKandang(): string {
    const titikKordinat = this.getKandangInfo()?.titik_kordinat;
    return titikKordinat ? String(titikKordinat) : '-';
  }

  getGoogleMapsLink(): string | null {
    const koordinat = this.parseKoordinat(this.getKandangInfo()?.titik_kordinat);

    if (!koordinat) {
      return null;
    }

    return `https://www.google.com/maps?q=${koordinat.lat},${koordinat.lng}`;
  }

  private loadKandangDetail(id: number) {
    this.kandangService.getKandangById(id).subscribe({
      next: (res: any) => {
        this.kandang = res?.data ?? res ?? null;
      },
      error: (err) => {
        console.warn('Gagal memuat detail kandang:', err);
      },
    });
  }

  private normalizeKandang(kandang: any): any {
    return kandang && typeof kandang === 'object' ? kandang : null;
  }

  private getKandangInfo(): any {
    return this.kandang ?? this.hewan?.kandang ?? null;
  }

  private parseKoordinat(
    raw: string | null | undefined,
  ): { lat: number; lng: number } | null {
    if (!raw) {
      return null;
    }

    const parts = String(raw)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (parts.length !== 2) {
      return null;
    }

    const lat = Number(parts[0]);
    const lng = Number(parts[1]);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return { lat, lng };
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
