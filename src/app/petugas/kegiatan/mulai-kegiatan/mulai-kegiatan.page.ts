import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { KegiatanService } from 'src/app/services/kegiatan.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-mulai-kegiatan',
  templateUrl: './mulai-kegiatan.page.html',
  styleUrls: ['./mulai-kegiatan.page.scss'],
  standalone: false,
})
export class MulaiKegiatanPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  kegiatan: any = null;
    uploadedPhotos: {
    url: string;
    file: File;
    name: string;
    size: number;
  }[] = [];

  isSubmitting = false;

  kegiatanId: string = '';
  selectedFiles: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private kegiatanService: KegiatanService
  ) {}

  ngOnInit() {
    this.kegiatanId = this.route.snapshot.paramMap.get('id') || '';
    this.loadKegiatanDetail();
  }

  /**
   * Load detail kegiatan dari database
   */
  async loadKegiatanDetail() {
    const loading = await this.loadingController.create({
      message: 'Memuat data...',
    });
    await loading.present();

    try {
      this.kegiatanService.getKegiatanById(Number(this.kegiatanId)).subscribe({
        next: (response: any) => {
          loading.dismiss();
          if (response.success) {
            this.kegiatan = response.data;
          } else {
            this.showToast(response.message || 'Gagal memuat data', 'danger');
            this.router.navigate(['/petugas/kegiatan']);
          }
        },
        error: (error: any) => {
          loading.dismiss();
          this.showToast(error.error?.message || 'Gagal memuat data kegiatan', 'danger');
          console.error('Error loading kegiatan:', error);
          this.router.navigate(['/petugas/kegiatan']);
        }
      });
    } catch (error: any) {
      await loading.dismiss();
      this.showToast('Gagal memuat data kegiatan', 'danger');
      console.error('Error loading kegiatan:', error);
    }
  }

  /**
   * Trigger file input untuk memilih foto
   */
  selectPhoto() {
    this.fileInput.nativeElement.click();
  }

  /**
   * Handle file yang dipilih
   */
  onFileSelected(event: any) {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      // Validasi jumlah foto (maksimal 10)
      if (this.uploadedPhotos.length + files.length > 10) {
        this.showToast('Maksimal 10 foto', 'warning');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
          this.showToast('File harus berupa gambar', 'warning');
          continue;
        }

        // Validasi ukuran file (maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showToast('Ukuran file maksimal 5MB', 'warning');
          continue;
        }

        // Convert ke base64 untuk preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedPhotos.push({
            url: e.target.result,
            file: file,
            name: file.name,
            size: file.size,
          });
        };
        reader.readAsDataURL(file);
      }

      // Reset input
      event.target.value = '';
    }
  }

  /**
   * Hapus foto dari list
   */
  async deletePhoto(index: number) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Hapus foto ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.uploadedPhotos.splice(index, 1);
            this.showToast('Foto dihapus', 'success');
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Selesaikan kegiatan
   */
  async selesai() {
    if (this.uploadedPhotos.length === 0) {
      this.showToast('Upload minimal 1 foto', 'warning');
      return;
    }

    this.isSubmitting = true;

    try {
      // 🔹 1. Upload semua foto SATU PER SATU
      for (const photo of this.uploadedPhotos) {
        const formData = new FormData();
        formData.append('foto', photo.file);

        await lastValueFrom(
          this.kegiatanService.uploadLaporan(this.kegiatan.id, formData)
        );
      }

      // 🔹 2. Setelah SEMUA upload selesai → SELESAIKAN KEGIATAN
      await lastValueFrom(
        this.kegiatanService.selesaikanKegiatan(this.kegiatan.id)
      );

      this.showToast(
      'Kegiatan selesai 🎉 Laporan berhasil dikirim ke admin',
      'success'
    );


      // 🔹 3. Balik ke jadwal
      this.router.navigate(['/petugas/kegiatan']);

    } catch (error) {
      console.error(error);
      this.showToast('Gagal menyelesaikan kegiatan', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }


  /**
   * Submit kegiatan ke server
   */
  async submitKegiatan() {
    const loading = await this.loadingController.create({
      message: 'Menyimpan data...',
    });
    await loading.present();

    try {
      // Prepare FormData untuk upload foto
      const formData = new FormData();
      
      // Append semua foto
      this.uploadedPhotos.forEach((photo) => {
        formData.append('foto[]', photo.file);
      });

      // Upload foto laporan dulu
      this.kegiatanService.uploadLaporan(Number(this.kegiatanId), formData).subscribe({
        next: (uploadResponse: any) => {
          if (uploadResponse.success) {
            // Setelah upload foto berhasil, selesaikan kegiatan
            this.kegiatanService.selesaikanKegiatan(Number(this.kegiatanId)).subscribe({
              next: (selesaiResponse: any) => {
                loading.dismiss();
                if (selesaiResponse.success) {
                  this.showToast('Kegiatan berhasil diselesaikan', 'success');
                  setTimeout(() => {
                    this.router.navigate(['/petugas/kegiatan']);
                  }, 1000);
                } else {
                  this.showToast(selesaiResponse.message || 'Gagal menyelesaikan kegiatan', 'danger');
                }
              },
              error: (error: any) => {
                loading.dismiss();
                this.showToast(error.error?.message || 'Gagal menyelesaikan kegiatan', 'danger');
                console.error('Error selesaikan kegiatan:', error);
              }
            });
          } else {
            loading.dismiss();
            this.showToast(uploadResponse.message || 'Gagal upload foto', 'danger');
          }
        },
        error: (error: any) => {
          loading.dismiss();
          this.showToast(error.error?.message || 'Gagal upload foto', 'danger');
          console.error('Error upload foto:', error);
        }
      });

    } catch (error: any) {
      await loading.dismiss();
      this.showToast('Gagal menyimpan data', 'danger');
      console.error('Error submit kegiatan:', error);
    }
  }

  /**
   * Helper untuk menampilkan toast
   */
  getFotoUrl(path: string): string {
    if (!path) return '';
    return `http://192.168.2.110:8000/storage/${path}`;
  }

  async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') 
    { const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
      icon:
        color === 'success'
          ? 'checkmark-circle'
          : color === 'warning'
          ? 'alert-circle'
          : color === 'danger'
          ? 'close-circle'
          : 'information-circle',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

}