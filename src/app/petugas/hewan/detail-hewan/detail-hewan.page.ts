import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-hewan',
  templateUrl: './detail-hewan.page.html',
  styleUrls: ['./detail-hewan.page.scss'],
  standalone: false
})
export class DetailHewanPage implements OnInit {

  hewan: any = null;
  isLoading = true;
  barcodeId = '';
  apiUrl = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // <-- BACA PARAM ROUTE

    if (id) {
      this.loadDetail(id);
    } else {
      this.showToast('ID hewan tidak ditemukan', 'danger');
    }
  }

  loadDetail(id: string) {
  this.isLoading = true;

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };

  this.http.get(`${this.apiUrl}/populasi/${id}`, { headers }).subscribe({
    next: (res: any) => {
  this.hewan = res.data ?? res;

  if (res.data?.qr_code) {
    this.barcodeId = `${this.apiUrl.replace('/api', '')}/storage/${res.data.qr_code}`;
  }

  this.isLoading = false;
},

    error: (err) => {
      console.log("DETAIL API ERROR →", err);
      this.isLoading = false;
      this.showToast('Gagal memuat detail', 'danger');
    },
  });
}



  viewBarcode() {
    this.showToast('Menampilkan barcode: ' + this.barcodeId, 'primary');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
  
}


