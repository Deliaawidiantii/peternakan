import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'notifikasi',
    loadChildren: () => import('./notifikasi/notifikasi.module').then( m => m.NotifikasiPageModule)
  },
  {
    path: 'data-pemilik',
    loadChildren: () => import('./data-pemilik/data-pemilik.module').then( m => m.DataPemilikPageModule)
  },
  {
    path: 'data-kandang',
    loadChildren: () => import('./data-kandang/data-kandang.module').then( m => m.DataKandangPageModule)
  },
  {
    path: 'data-hewan',
    loadChildren: () => import('./data-hewan/data-hewan.module').then( m => m.DataHewanPageModule)
  },
  {
    path: 'kandang',
    loadChildren: () => import('./kandang/kandang.module').then( m => m.KandangPageModule)
  },
  {
    path: 'detail-kandang',
    loadChildren: () => import('./detail-kandang/detail-kandang.module').then( m => m.DetailKandangPageModule)
  },
  {
    path: 'hewan',
    loadChildren: () => import('./hewan/hewan.module').then( m => m.HewanPageModule)
  },
  {
    path: 'detail-hewan',
    loadChildren: () => import('./detail-hewan/detail-hewan.module').then( m => m.DetailHewanPageModule)
  },
  {
    path: 'pemilik',
    loadChildren: () => import('./pemilik/pemilik.module').then( m => m.PemilikPageModule)
  },
  {
    path: 'detail-pemilik',
    loadChildren: () => import('./detail-pemilik/detail-pemilik.module').then( m => m.DetailPemilikPageModule)
  },
  {
    path: 'kegiatan',
    loadChildren: () => import('./kegiatan/kegiatan.module').then( m => m.KegiatanPageModule)
  },
  {
    path: 'detail-kegiatan',
    loadChildren: () => import('./detail-kegiatan/detail-kegiatan.module').then( m => m.DetailPetugasPageModule)
  },
  {
    path: 'mulai-kegiatan',
    loadChildren: () => import('./mulai-kegiatan/mulai-kegiatan.module').then( m => m.MulaiKegiatanPageModule)
  },
  {
    path: 'jadwal-kegiatan',
    loadChildren: () => import('./jadwal-kegiatan/jadwal-kegiatan.module').then( m => m.JadwalKegiatanPageModule)
  },
  {
    path: 'riwayat-kegiatan',
    loadChildren: () => import('./riwayat-kegiatan/riwayat-kegiatan.module').then( m => m.RiwayatKegiatanPageModule)
  },
  {
    path: 'penyakit',
    loadChildren: () => import('./penyakit/penyakit.module').then( m => m.PenyakitPageModule)
  },
  {
    path: 'buku-lahir',
    loadChildren: () => import('./buku-lahir/buku-lahir.module').then( m => m.BukuLahirPageModule)
  },
  {
    path: 'mutasi',
    loadChildren: () => import('./mutasi/mutasi.module').then( m => m.MutasiPageModule)
  },
  {
    path: 'laporan-kasus-penyakit',
    loadChildren: () => import('./laporan-kasus-penyakit/laporan-kasus-penyakit.module').then( m => m.LaporanKasusPenyakitPageModule)
  },
  {
    path: 'daftar-penyakit',
    loadChildren: () => import('./daftar-penyakit/daftar-penyakit.module').then( m => m.DaftarPenyakitPageModule)
  },
  {
    path: 'detail-penyakit',
    loadChildren: () => import('./detail-penyakit/detail-penyakit.module').then( m => m.DetailPenyakitPageModule)
  },
  {
    path: 'update-status-penyakit',
    loadChildren: () => import('./update-status-penyakit/update-status-penyakit.module').then( m => m.UpdateStatusPenyakitPageModule)
  },
  {
    path: 'riwayat-perkembangan-penyakit',
    loadChildren: () => import('./riwayat-perkembangan-penyakit/riwayat-perkembangan-penyakit.module').then( m => m.RiwayatPerkembanganPenyakitPageModule)
  },
  {
    path: 'ruminansia',
    loadChildren: () => import('./ruminansia/ruminansia.module').then( m => m.RuminansiaPageModule)
  },
  {
    path: 'kesayangan',
    loadChildren: () => import('./kesayangan/kesayangan.module').then( m => m.KesayanganPageModule)
  },
  {
    path: 'primata',
    loadChildren: () => import('./primata/primata.module').then( m => m.PrimataPageModule)
  },
  {
    path: 'unggas',
    loadChildren: () => import('./unggas/unggas.module').then( m => m.UnggasPageModule)
  },
  {
    path: 'mutasi-mati',
    loadChildren: () => import('./mutasi-mati/mutasi-mati.module').then( m => m.MutasiMatiPageModule)
  },
  {
    path: 'mutasi-hilang',
    loadChildren: () => import('./mutasi-hilang/mutasi-hilang.module').then( m => m.MutasiHilangPageModule)
  },
  {
    path: 'mutasi-dipotong',
    loadChildren: () => import('./mutasi-dipotong/mutasi-dipotong.module').then( m => m.MutasiDipotongPageModule)
  },
  {
    path: 'mutasidijual',
    loadChildren: () => import('./mutasidijual/mutasidijual.module').then( m => m.MutasidijualPageModule)
  },
  {
    path: 'mutasi-pindah',
    loadChildren: () => import('./mutasi-pindah/mutasi-pindah.module').then( m => m.MutasiPindahPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'detail-kelahiran',
    loadChildren: () => import('./detail-kelahiran/detail-kelahiran.module').then( m => m.DetailKelahiranPageModule)
  },
  {
    path: 'request-kegiatan',
    loadChildren: () => import('./request-kegiatan/request-kegiatan.module').then( m => m.RequestKegiatanPageModule)
  },
  {
    path: 'detail-mutasi',
    loadChildren: () => import('./detail-mutasi/detail-mutasi.module').then( m => m.DetailMutasiPageModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetugasRoutingModule {}