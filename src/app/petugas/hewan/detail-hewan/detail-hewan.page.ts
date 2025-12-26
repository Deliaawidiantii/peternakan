import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Tambah Router
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-hewan',
  templateUrl: './detail-hewan.page.html',
  styleUrls: ['./detail-hewan.page.scss'],
  standalone: false
})
export class DetailHewanPage implements OnInit {

  hewan: any = {}; // Ubah dari null ke empty object
  isLoading = true;
  barcodeId = '';
  apiUrl = 'http://192.168.2.114:8000/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router // Tambah Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID:', id);
    console.log('🔑 Token exists:', !!localStorage.getItem('token'));

    if (id) {
      this.loadDetail(id);
    } else {
      this.showToast('ID hewan tidak ditemukan', 'danger');
      this.router.navigate(['/hewan']); // Redirect ke list hewan
    }
  }

  loadDetail(id: string) {
    this.isLoading = true;

    const token = localStorage.getItem('token');
    console.log('🔑 Token:', token);
    console.log('📍 Loading detail for ID:', id);

    // Cek token dulu
    if (!token) {
      console.log('❌ No token found');
      this.showToast('Sesi Anda telah berakhir', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.get(`${this.apiUrl}/populasi/${id}`, { headers }).subscribe({
      next: (res: any) => {
        console.log('✅ Success:', res);
        this.hewan = res.data ?? res;

        // Pastikan hewan punya data
        if (!this.hewan || Object.keys(this.hewan).length === 0) {
          console.log('⚠️ Empty data received');
          this.showToast('Data hewan tidak ditemukan', 'warning');
          this.router.navigate(['/hewan']);
          return;
        }

        if (this.hewan.qr_code) {
          this.barcodeId = `${this.apiUrl.replace('/api', '')}/storage/${this.hewan.qr_code}`;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.log("❌ ERROR Object:", err);
        console.log("❌ Status Code:", err.status);
        console.log("❌ Error Message:", err.message);
        console.log("❌ Error Body:", err.error);
        
        this.isLoading = false;

        // Handle 401 Unauthorized (token expired/invalid)
        if (err.status === 401) {
          console.log('🔒 Unauthorized - removing token');
          localStorage.removeItem('token');
          this.showToast('Sesi Anda telah berakhir', 'warning');
          this.router.navigate(['/login']);
          return;
        }

        // Handle 404 Not Found
        if (err.status === 404) {
          this.showToast('Data hewan tidak ditemukan', 'danger');
          this.router.navigate(['/hewan']);
          return;
        }

        // Handle error lainnya
        const errorMsg = err.error?.message || 'Gagal memuat detail';
        this.showToast(errorMsg, 'danger');
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