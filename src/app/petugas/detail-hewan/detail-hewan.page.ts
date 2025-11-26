import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detail-hewan',
  templateUrl: './detail-hewan.page.html',
  styleUrls: ['./detail-hewan.page.scss'],
  standalone: false,
})
export class DetailHewanPage implements OnInit {

  hewanId: string = '';
  barcodeId: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getHewanId();
  }

  getHewanId() {
    this.route.queryParams.subscribe(params => {
      this.hewanId = params['id'] || '2024sapi';
      this.generateBarcode();
    });
  }

  generateBarcode() {
    // Generate barcode ID dari hewan
    this.barcodeId = `HEWAN-${this.hewanId}-${Date.now()}`;
  }

  viewBarcode() {
    console.log('View barcode:', this.barcodeId);
    this.showToast('Menampilkan barcode: ' + this.barcodeId, 'info');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

}