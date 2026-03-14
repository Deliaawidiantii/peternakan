import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PopulasiService } from '../../services/populasi.service';

interface BarcodeData {
  sourceId: number | null;
  scannedCode: string;
  idHewan: string;
  kelompokHewan: string;
  jenisHewan: string;
  tanggalLahir: string;
  jenisKelamin: string;
  pemilik: string;
}

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: false
})
export class ScanPage implements OnInit {

  isModalOpen = false;
  isScanning = false;
  isFetching = false;
  barcodeData: BarcodeData | null = null;
  modalMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private populasiService: PopulasiService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.startScanning();

    this.route.queryParamMap.subscribe((params) => {
      const value = params.get('value') || params.get('code') || params.get('eartag');
      if (value) {
        this.onBarcodeDetected(value);
      }
    });
  }

  goBack() {
    window.history.back();
  }

  startScanning() {
    this.isScanning = true;
    this.isFetching = false;
    this.barcodeData = null;
    this.modalMessage = '';
    console.log('Mulai scanning barcode...');
  }

  onBarcodeDetected(barcodeValue: string) {
    const value = String(barcodeValue || '').trim();
    if (!value) {
      this.showToast('Barcode tidak valid', 'warning');
      return;
    }

    console.log('Barcode terdeteksi:', value);
    this.isScanning = false;
    this.isModalOpen = true;
    this.isFetching = true;
    this.barcodeData = null;
    this.modalMessage = '';
    this.fetchBarcodeData(value);
  }

  fetchBarcodeData(barcodeValue: string) {
    const params = {
      search: barcodeValue,
      q: barcodeValue,
      code: barcodeValue,
      eartag: barcodeValue,
    };

    this.populasiService.getPopulasi(params).subscribe({
      next: (res: any) => {
        this.isFetching = false;
        const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const match = this.findMatch(rows, barcodeValue);

        if (!match) {
          this.barcodeData = null;
          this.modalMessage = `Data hewan dengan barcode ${barcodeValue} tidak ditemukan.`;
          return;
        }

        this.barcodeData = this.mapToBarcodeData(match, barcodeValue);
      },
      error: () => {
        this.isFetching = false;
        this.barcodeData = null;
        this.modalMessage = 'Gagal memuat data barcode. Periksa koneksi lalu coba lagi.';
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  scanBarcode() {
    console.log('Scan ulang dijalankan...');
    this.isModalOpen = false;
    this.startScanning();
  }

  confirmScan() {
    if (this.barcodeData) {
      console.log('Data barcode dikonfirmasi:', this.barcodeData);
      this.isModalOpen = false;

      if (this.barcodeData.sourceId) {
        this.router.navigate(['/petugas/detail-hewan', this.barcodeData.sourceId]);
      }
    }
  }

  private findMatch(rows: any[], barcodeValue: string): any | null {
    const normalized = this.normalize(barcodeValue);

    return (
      rows.find((item: any) => {
        const candidates = [
          item?.code,
          item?.eartag,
          item?.id_hewan,
          item?.barcode,
          item?.qr_code,
          item?.id ? String(item.id) : '',
        ];

        return candidates.some((candidate) => this.normalize(candidate) === normalized);
      }) || null
    );
  }

  private mapToBarcodeData(item: any, scannedCode: string): BarcodeData {
    const jenis = this.firstNonEmpty(item?.jenis_hewan, item?.jenis, '-');

    return {
      sourceId: item?.id ? Number(item.id) : null,
      scannedCode,
      idHewan: this.firstNonEmpty(item?.code, item?.eartag, item?.id_hewan, scannedCode),
      kelompokHewan: this.inferKelompok(jenis),
      jenisHewan: jenis,
      tanggalLahir: this.formatDate(item?.tanggal_lahir),
      jenisKelamin: this.capitalize(this.firstNonEmpty(item?.jenis_kelamin, '-')),
      pemilik: this.firstNonEmpty(
        item?.peternakan?.nama_peternak,
        item?.pemilik,
        item?.peternak?.nama,
        '-',
      ),
    };
  }

  private inferKelompok(jenis: string): string {
    const j = this.normalize(jenis);
    if (['sapi', 'kambing', 'domba', 'kerbau'].includes(j)) return 'Ruminansia';
    if (['ayam', 'itik', 'angsa', 'kalkun'].includes(j)) return 'Unggas';
    if (['anjing', 'kucing', 'kelinci', 'burung', 'reptil'].includes(j)) return 'Kesayangan';
    if (['monyet', 'kera', 'gibbon', 'lemur'].includes(j)) return 'Primata';
    return 'Lainnya';
  }

  private formatDate(value: any): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private firstNonEmpty(...values: any[]): string {
    for (const value of values) {
      const text = String(value ?? '').trim();
      if (text) return text;
    }
    return '-';
  }

  private capitalize(value: string): string {
    if (!value || value === '-') return '-';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  private normalize(value: any): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');
  }

  private async showToast(message: string, color: 'warning' | 'danger' | 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

}