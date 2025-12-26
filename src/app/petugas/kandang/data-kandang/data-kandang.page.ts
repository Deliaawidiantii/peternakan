import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController, ToastController, ActionSheetController } from '@ionic/angular'; // ✅ TAMBAH ActionSheetController
import { KandangService } from 'src/app/services/kandang.service';
import { PeternakService } from 'src/app/services/peternak.service';
import { WilayahService } from 'src/app/services/wilayah.service';

@Component({
  selector: 'app-data-kandang',
  templateUrl: './data-kandang.page.html',
  styleUrls: ['./data-kandang.page.scss'],
  standalone: false,
})
export class DataKandangPage implements OnInit {
  
  previewUrl: string | undefined;
  
  // ✅ TAMBAH: Form Data
  formData = {
    nama_kandang: '',
    peternak_id: 0,
    wilayah_id: 0,
    jenis_komoditas: '',
    kapasitas: 0,
    status_kandang: 'Individu',
    titik_kordinat: '',
    foto_kandang: null as File | null
  };

  // ✅ TAMBAH: Dropdown data
  peternakList: any[] = [];
  wilayahList: any[] = [];

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController, // ✅ TAMBAH INI
    private kandangService: KandangService,
    private peternakService: PeternakService,
    private wilayahService: WilayahService
  ) { }

  ngOnInit() {
    // ✅ TAMBAH: Load dropdown data
    this.loadDropdownData();
  }

  // ✅ TAMBAH: Load data peternak & wilayah
  async loadDropdownData() {
    this.peternakService.getAll().subscribe({
      next: (res) => {
        this.peternakList = res.data || [];
      },
      error: () => {
        this.showToast('Gagal memuat daftar pemilik', 'danger');
      }
    });

    this.wilayahService.getWilayah().subscribe({
      next: (res: any) => {
        this.wilayahList = res.data ?? [];
      },
      error: () => {
        this.showToast('Gagal memuat daftar desa', 'danger');
      }
    });
  }


  // ✅ UPDATE: Ambil foto dari camera/gallery dengan pilihan
  async takePicture() {
    // Kalau bukan native platform, tampilkan ActionSheet untuk pilih
    if (!Capacitor.isNativePlatform()) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Pilih Sumber Foto',
        buttons: [
          {
            text: 'Kamera',
            icon: 'camera',
            handler: () => {
              this.openCamera();
            }
          },
          {
            text: 'File/Galeri',
            icon: 'images',
            handler: () => {
              document.getElementById('fileInput')?.click();
            }
          },
          {
            text: 'Batal',
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
      return;
    }

    // Kalau di native, langsung pake Camera.getPhoto dengan Prompt
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // User pilih Camera atau Gallery
        promptLabelHeader: 'Pilih Sumber',
        promptLabelPhoto: 'Dari Galeri',
        promptLabelPicture: 'Ambil Foto'
      });

      this.previewUrl = image.dataUrl!;

      // Convert base64 ke file
      const arr = image.dataUrl!.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);

      this.formData.foto_kandang = new File([u8arr], `kandang_${Date.now()}.jpg`, {
        type: mime,
      });

    } catch (err) {
      console.log(err);
      this.showToast('Gagal mengambil foto', 'danger');
    }
  }

  // ✅ TAMBAH: Method khusus buka camera
  async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Langsung buka camera
      });

      this.previewUrl = image.dataUrl!;

      const arr = image.dataUrl!.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);

      this.formData.foto_kandang = new File([u8arr], `kandang_${Date.now()}.jpg`, {
        type: mime,
      });

    } catch (err) {
      console.error(err);
      this.showToast('Gagal membuka kamera', 'danger');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.formData.foto_kandang = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  // ✅ TAMBAH: Hapus foto preview
  removePhoto() {
    this.previewUrl = undefined;
    this.formData.foto_kandang = null;
    
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

    // ✅ TAMBAH: Convert Base64 to Blob
    base64ToBlob(base64: string, contentType: string): Blob {
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    }

  // ✅ TAMBAH: Get Current Location (GPS)
  async getCurrentLocation() {
    const loading = await this.loadingCtrl.create({
      message: 'Mengambil lokasi...'
    });
    await loading.present();

    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.formData.titik_kordinat = `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`;
      
      await loading.dismiss();
      await this.showToast('Lokasi berhasil diambil', 'success');
    } catch (error) {
      await loading.dismiss();
      console.error('Error getting location:', error);
      await this.showToast('Gagal mengambil lokasi GPS', 'danger');
    }
  }

  // ✅ TAMBAH: Validate Form
  validateForm(): boolean {
    if (!this.formData.nama_kandang) {
      this.showToast('Nama kandang harus diisi', 'warning');
      return false;
    }
    if (!this.formData.peternak_id || this.formData.peternak_id === 0) {
      this.showToast('Pemilik harus dipilih', 'warning');
      return false;
    }
    if (!this.formData.wilayah_id || this.formData.wilayah_id === 0) {
      this.showToast('Desa harus dipilih', 'warning');
      return false;
    }
    if (!this.formData.jenis_komoditas) {
      this.showToast('Jenis komoditas harus diisi', 'warning');
      return false;
    }
    if (!this.formData.kapasitas || this.formData.kapasitas <= 0) {
      this.showToast('Kapasitas harus lebih dari 0', 'warning');
      return false;
    }
    if (!this.formData.status_kandang) {
      this.showToast('Status kandang harus dipilih', 'warning');
      return false;
    }
    return true;
  }

  // ✅ TAMBAH: Submit Form
  async submitForm() {
  console.log('🔵 1. Form Data:', this.formData);
  console.log('🔵 2. Token:', localStorage.getItem('token'));
  
  if (!this.validateForm()) {
    return;
  }

  const loading = await this.loadingCtrl.create({
    message: 'Menyimpan data kandang...'
  });
  await loading.present();

  // Build FormData
  const formData = new FormData();
  formData.append('nama_kandang', this.formData.nama_kandang);
  formData.append('peternak_id', this.formData.peternak_id.toString());
  formData.append('wilayah_id', this.formData.wilayah_id.toString());
  formData.append('jenis_komoditas', this.formData.jenis_komoditas);
  formData.append('kapasitas', this.formData.kapasitas.toString());
  formData.append('status_kandang', this.formData.status_kandang);
  
  if (this.formData.titik_kordinat) {
    formData.append('titik_kordinat', this.formData.titik_kordinat);
  }
  
  if (this.formData.foto_kandang) {
    formData.append('foto_kandang', this.formData.foto_kandang);
  }

  console.log('🔵 3. FormData yang akan dikirim:');
  formData.forEach((value, key) => {
    console.log(`  ${key}:`, value);
  });

  this.kandangService.createKandang(formData).subscribe({
    next: async (response) => {
      console.log('✅ SUCCESS Response:', response);
      await loading.dismiss();

      if (response.success) {
        await this.showToast('Kandang berhasil ditambahkan', 'success');
        this.router.navigate(['/petugas/kandang']);
      } else {
        await this.showToast(response.message || 'Terjadi kesalahan', 'danger');
      }
    },
    error: async (error) => {
      console.error('❌ ERROR Response:', error);
      console.error('❌ Error Status:', error.status);
      console.error('❌ Error Message:', error.message);
      console.error('❌ Error Detail:', error.error);
      
      await loading.dismiss();

      let errorMessage = 'Terjadi kesalahan saat menyimpan data';
      
      // Cek tipe error
      if (error.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (error.status === 422) {
        if (error.error?.errors) {
          const errors = Object.values(error.error.errors).reduce((a: any[], b: any) => a.concat(b), []);
          errorMessage = errors.join(', ');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      await this.showToast(errorMessage, 'danger');
    }
  });
}
  // ✅ TAMBAH: Cancel & Go Back
  cancel() {
    this.router.navigate(['/petugas/kandang']);
  }

  // ✅ TAMBAH: Show Toast
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}