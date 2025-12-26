import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WilayahService } from 'src/app/services/wilayah.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  user: any = null;
  isLoading: boolean = true;
  namaDesa: string = ''; // ← TAMBAHAN: untuk menyimpan nama desa

  constructor(
    private authService: AuthService,
    private router: Router,
    private wilayahService: WilayahService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  ionViewWillEnter() {
    // Reload profile setiap kali masuk ke page
    this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;

    // Coba ambil dari localStorage dulu
    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.user = cachedUser;
      this.loadNamaDesa(); // ← TAMBAHAN: load nama desa
      this.isLoading = false;
    }

    // Fetch dari API untuk data terbaru
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Ambil data dari localStorage untuk preserve wilayah_id
          const existingUser = this.authService.getUser();
          
          // Merge data: API data + wilayah_id dari localStorage
          this.user = {
            ...response.data,
            wilayah_id: response.data.wilayah_id || existingUser?.wilayah_id || null
          };
          
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(this.user));
          this.loadNamaDesa(); // ← TAMBAHAN: load nama desa setelah dapat data user
        }
      },
      error: async (error) => {
        this.isLoading = false;
        console.error('Error loading profile:', error);

        if (error.status === 401) {
          // Token expired, redirect ke login
          const alert = await this.alertController.create({
            header: 'Sesi Berakhir',
            message: 'Sesi login Anda telah berakhir. Silakan login kembali.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.navigateRoot('/login');
                }
              }
            ]
          });
          await alert.present();
        }
      }
    });
  }

  // ← TAMBAHAN: Method untuk load nama desa berdasarkan wilayah_id
  loadNamaDesa() {
    if (!this.user) {
      this.namaDesa = '-';
      return;
    }

    // Debug: Log seluruh data user untuk cek struktur
    console.log('🔍 Debug User Data di Profile:', this.user);

    // ✅ PERBAIKAN: desa_binaan itu sebenernya ID wilayah
    const wilayahId = this.user.desa_binaan || 
                      this.user.wilayah_id || 
                      this.user.desa_id || 
                      this.user.id_wilayah || 
                      this.user.id_desa ||
                      this.user.wilayahId ||
                      this.user.desaId ||
                      null;

    console.log('📍 Wilayah ID dari User:', wilayahId);

    if (!wilayahId) {
      console.warn('⚠️ User tidak memiliki wilayah_id');
      this.namaDesa = '-';
      return;
    }

    // Fetch data wilayah dari database
    this.wilayahService.getWilayah().subscribe({
      next: (response: any) => {
        let wilayahList = [];

        if (response.success && response.data) {
          wilayahList = response.data;
        } else if (Array.isArray(response)) {
          wilayahList = response;
        }

        console.log('🗺️ Data Wilayah dari DB:', wilayahList);

        // Cari wilayah berdasarkan ID
        const wilayah = wilayahList.find((w: any) => w.id === wilayahId);

        console.log('🔎 Wilayah yang ditemukan:', wilayah);

        if (wilayah) {
          // Ambil nama desa (cek berbagai kemungkinan field name)
          this.namaDesa = wilayah.nama_desa || 
                         wilayah.nama || 
                         wilayah.desa || 
                         'Desa tidak ditemukan';
          
          console.log('✅ Nama Desa Final:', this.namaDesa);
        } else {
          this.namaDesa = 'Desa tidak ditemukan';
          console.warn('⚠️ Wilayah ID tidak cocok dengan data di database');
        }
      },
      error: (err: any) => {
        console.error('❌ Error loading wilayah:', err);
        this.namaDesa = 'Error memuat data';
      }
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Logging out...',
              spinner: 'crescent'
            });
            await loading.present();

            this.authService.logout().subscribe({
              next: async (response) => {
                await loading.dismiss();
                
                const successAlert = await this.alertController.create({
                  header: 'Berhasil',
                  message: 'Anda telah logout',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.navigateRoot('/login');
                      }
                    }
                  ]
                });
                await successAlert.present();
              },
              error: async (error) => {
                await loading.dismiss();
                console.error('Logout error:', error);
                
                // Tetap redirect ke login meskipun API error
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.navCtrl.navigateRoot('/login');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  goToEditProfile() {
    this.router.navigate(['/petugas/edit-profile']);
  }
}