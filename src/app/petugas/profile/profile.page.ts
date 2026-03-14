import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WilayahService } from '../../services/wilayah.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any = null;
  isLoading = true;
  namaDesa = '-';
  private storageBaseUrl = environment.apiUrl.replace(/\/api$/, '');

  constructor(
    private authService: AuthService,
    private router: Router,
    private wilayahService: WilayahService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;

    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.user = cachedUser;
      this.namaDesa = this.resolveCachedVillage(cachedUser);
      this.isLoading = false;
    }

    this.authService.getProfile().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.loadNamaDesa();
        }
      },
      error: async (error) => {
        this.isLoading = false;
        console.error('Error loading profile:', error);

        if (error.status === 401) {
          const alert = await this.alertController.create({
            header: 'Sesi Berakhir',
            message: 'Sesi login Anda telah berakhir. Silakan login kembali.',
            buttons: [
              {
                text: 'OK',
                handler: () => this.navCtrl.navigateRoot('/login'),
              },
            ],
          });
          await alert.present();
        }
      },
    });
  }

  getAvatarUrl(): string {
    if (this.user?.foto_url) {
      return this.user.foto_url;
    }

    if (this.user?.foto && String(this.user.foto).startsWith('http')) {
      return this.user.foto;
    }

    if (this.user?.foto) {
      return `${this.storageBaseUrl}/storage/${this.user.foto}`;
    }

    const nama = encodeURIComponent(this.user?.nama || 'Petugas');
    return `https://ui-avatars.com/api/?name=${nama}&background=295380&color=ffffff&size=200&font-size=0.36&bold=true`;
  }

  getRoleLabel(): string {
    return this.user?.role === 'petugas' ? 'Petugas Lapangan' : this.user?.role || 'Pengguna';
  }

  private resolveCachedVillage(user: any): string {
    if (user?.namaDesa) {
      return user.namaDesa;
    }
    return user?.desa_binaan_nama || '-';
  }

  loadNamaDesa() {
    if (!this.user) {
      this.namaDesa = '-';
      return;
    }

    const wilayahId = this.user.desa_binaan || this.user.wilayah_id || null;

    if (!wilayahId) {
      this.namaDesa = '-';
      return;
    }

    this.wilayahService.getPublicWilayah().subscribe({
      next: (response: any) => {
        const wilayahList = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        const wilayah = wilayahList.find((item: any) => Number(item.id) === Number(wilayahId));
        this.namaDesa = wilayah?.nama_desa || '-';
      },
      error: () => {
        this.namaDesa = '-';
      },
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Logging out...',
              spinner: 'crescent',
            });
            await loading.present();

            this.authService.logout().subscribe({
              next: async () => {
                await loading.dismiss();
                this.navCtrl.navigateRoot('/login');
              },
              error: async () => {
                await loading.dismiss();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.navCtrl.navigateRoot('/login');
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  goToEditProfile() {
    this.router.navigate(['/petugas/edit-profile']);
  }
}
