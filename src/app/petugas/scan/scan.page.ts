import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface BarcodeData {
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
  barcodeData: BarcodeData | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startScanning();
  }

  goBack() {
    window.history.back();
  }

  startScanning() {
    this.isScanning = true;
    console.log("Mulai scanning barcode...");
    
    // Simulasi scanning - ganti dengan library barcode scanner sebenarnya
    setTimeout(() => {
      this.onBarcodeDetected('KRW-3215-00123');
    }, 2000);
  }

  onBarcodeDetected(barcodeValue: string) {
    console.log("Barcode terdeteksi:", barcodeValue);
    this.fetchBarcodeData(barcodeValue);
  }

  fetchBarcodeData(barcodeValue: string) {
    // Simulasi fetch dari API
    // Ganti dengan API call sebenarnya
    this.barcodeData = {
      idHewan: barcodeValue,
      kelompokHewan: 'Maju Jaya',
      jenisHewan: 'Sapi Perah',
      tanggalLahir: '15-08-2022',
      jenisKelamin: 'Betina',
      pemilik: 'H. Asep'
    };

    this.isScanning = false;
    this.openModal();
  }

  openModal() {
    this.isModalOpen = true;
  }

  scanBarcode() {
    console.log("Scan ulang dijalankan...");
    this.isModalOpen = false;
    this.startScanning();
  }

  confirmScan() {
    if (this.barcodeData) {
      console.log("Data barcode dikonfirmasi:", this.barcodeData);
      this.isModalOpen = false;
      // Navigasi ke halaman berikutnya jika diperlukan
      // this.router.navigate(['/next-page'], { state: { data: this.barcodeData } });
    }
  }

}