import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { WilayahService } from '../../../services/wilayah.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form = {
    nama: '',
    nik: '',
    alamat: '',
    no_telp: '',
    desa_binaan: '',
  };

  wilayahList: any[] = [];
  previewUrl: string | null = null;
  selectedPhoto: File | null = null;
  statusLabel = '-';
  userEmail = '';
  isLoading = false;
  private storageBaseUrl = environment.apiUrl.replace(/\/api$/, '');

  constructor(
    private authService: AuthService,
    private wilayahService: WilayahService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  ionViewWillEnter() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.loadProfile();
    this.loadWilayah();
  }

  private loadProfile() {
    const cachedUser = this.authService.getUser();
    if (cachedUser) {
      this.patchForm(cachedUser);
    }

    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          this.patchForm(response.data);
        }
      },
      error: async () => {
        await this.presentToast('Gagal memuat data profil', 'danger');
      },
    });
  }

  private patchForm(user: any) {
    this.form = {
      nama: user?.nama || '',
      nik: user?.nik || '',
      alamat: user?.alamat || '',
      no_telp: user?.no_telp || '',
      desa_binaan: String(user?.desa_binaan || user?.wilayah_id || ''),
    };
    this.statusLabel = user?.is_verified ? 'Terverifikasi' : 'Belum terverifikasi';
    this.userEmail = user?.email || '-';
    this.previewUrl = this.resolvePhotoUrl(user);
  }

  private resolvePhotoUrl(user: any): string | null {
    if (this.selectedPhoto && this.previewUrl) {
      return this.previewUrl;
    }

    if (user?.foto_url) {
      return user.foto_url;
    }

    if (user?.foto && String(user.foto).startsWith('http')) {
      return user.foto;
    }

    if (user?.foto) {
      return `${this.storageBaseUrl}/storage/${user.foto}`;
    }

    return null;
  }

  private loadWilayah() {
    this.wilayahService.getPublicWilayah().subscribe({
      next: (response: any) => {
        this.wilayahList = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      },
      error: () => {
        this.wilayahList = [];
      },
    });
  }

  selectPhoto() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) {
      return;
    }

    this.selectedPhoto = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async saveProfile() {
    if (!this.form.nama || !this.form.nik) {
      await this.presentToast('Nama dan NIK wajib diisi', 'danger');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan profil...' });
    await loading.present();

    const payload = new FormData();
    payload.append('nama', this.form.nama);
    payload.append('nik', this.form.nik);
    payload.append('alamat', this.form.alamat || '');
    payload.append('no_telp', this.form.no_telp || '');
    if (this.form.desa_binaan) {
      payload.append('desa_binaan', this.form.desa_binaan);
    }
    if (this.selectedPhoto) {
      payload.append('foto', this.selectedPhoto);
    }

    this.authService.updateProfile(payload).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;
        await this.presentToast('Profil berhasil diperbarui', 'success');
        this.router.navigate(['/petugas/tabs/profile']);
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        const message = error?.error?.message || 'Gagal menyimpan profil';
        await this.presentToast(message, 'danger');
      },
    });
  }

  cancel() {
    this.router.navigate(['/petugas/tabs/profile']);
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
