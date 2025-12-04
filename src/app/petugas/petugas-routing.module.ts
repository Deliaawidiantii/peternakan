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
    loadChildren: () => import('./profile/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./informasi/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'notifikasi',
    loadChildren: () => import('./notifikasi/notifikasi.module').then( m => m.NotifikasiPageModule)
  },
  {
    path: 'data-pemilik',
    loadChildren: () => import('./pemilik/data-pemilik/data-pemilik.module').then( m => m.DataPemilikPageModule)
  },
  {
    path: 'data-pemilik/:id',
    loadChildren: () => import('./pemilik/data-pemilik/data-pemilik.module').then( m => m.DataPemilikPageModule)
  },
  {
    path: 'data-kandang',
    loadChildren: () => import('./kandang/data-kandang/data-kandang.module').then( m => m.DataKandangPageModule)
  },
  {
    path: 'data-hewan',
    loadChildren: () => import('./hewan/data-hewan/data-hewan.module').then( m => m.DataHewanPageModule)
  },
  {
    path: 'kandang',
    loadChildren: () => import('./kandang/kandang.module').then( m => m.KandangPageModule)
  },
  {
    path: 'detail-kandang',
    loadChildren: () => import('./kandang/detail-kandang/detail-kandang.module').then( m => m.DetailKandangPageModule)
  },
  {
    path: 'hewan',
    loadChildren: () => import('./hewan/hewan.module').then( m => m.HewanPageModule)
  },
  {
    path: 'detail-hewan/:id',
    loadChildren: () => import('./hewan/detail-hewan/detail-hewan.module').then(m => m.DetailHewanPageModule)
  },
  {
    path: 'pemilik',
    loadChildren: () => import('./pemilik/pemilik.module').then( m => m.PemilikPageModule)
  },
  {
    path: 'detail-pemilik/:id',
    loadChildren: () => import('./pemilik/detail-pemilik/detail-pemilik.module').then( m => m.DetailPemilikPageModule)
  },
  {
    path: 'kegiatan',
    loadChildren: () => import('./kegiatan/kegiatan.module').then( m => m.KegiatanPageModule)
  },
  {
    path: 'detail-kegiatan',
    loadChildren: () => import('./kegiatan/detail-kegiatan/detail-kegiatan.module').then( m => m.DetailPetugasPageModule)
  },
  {
    path: 'mulai-kegiatan',
    loadChildren: () => import('./kegiatan/mulai-kegiatan/mulai-kegiatan.module').then( m => m.MulaiKegiatanPageModule)
  },
  {
    path: 'jadwal-kegiatan',
    loadChildren: () => import('./kegiatan/jadwal-kegiatan/jadwal-kegiatan.module').then( m => m.JadwalKegiatanPageModule)
  },
  {
    path: 'riwayat-kegiatan',
    loadChildren: () => import('./kegiatan/riwayat-kegiatan/riwayat-kegiatan.module').then( m => m.RiwayatKegiatanPageModule)
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
    loadChildren: () => import('./penyakit/laporan-kasus-penyakit/laporan-kasus-penyakit.module').then( m => m.LaporanKasusPenyakitPageModule)
  },
  {
    path: 'daftar-penyakit',
    loadChildren: () => import('./penyakit/daftar-penyakit/daftar-penyakit.module').then( m => m.DaftarPenyakitPageModule)
  },
  {
    path: 'detail-penyakit',
    loadChildren: () => import('./penyakit/detail-penyakit/detail-penyakit.module').then( m => m.DetailPenyakitPageModule)
  },
  {
    path: 'update-status-penyakit',
    loadChildren: () => import('./penyakit/update-status-penyakit/update-status-penyakit.module').then( m => m.UpdateStatusPenyakitPageModule)
  },
  {
    path: 'riwayat-perkembangan-penyakit',
    loadChildren: () => import('./riwayat-perkembangan-penyakit/riwayat-perkembangan-penyakit.module').then( m => m.RiwayatPerkembanganPenyakitPageModule)
  },
  {
    path: 'ruminansia',
    loadChildren: () => import('./buku-lahir/ruminansia/ruminansia.module').then( m => m.RuminansiaPageModule)
  },
  {
    path: 'kesayangan',
    loadChildren: () => import('./buku-lahir/kesayangan/kesayangan.module').then( m => m.KesayanganPageModule)
  },
  {
    path: 'primata',
    loadChildren: () => import('./buku-lahir/primata/primata.module').then( m => m.PrimataPageModule)
  },
  {
    path: 'unggas',
    loadChildren: () => import('./buku-lahir/unggas/unggas.module').then( m => m.UnggasPageModule)
  },
  {
    path: 'mutasi-mati',
    loadChildren: () => import('./mutasi/mutasi-mati/mutasi-mati.module').then( m => m.MutasiMatiPageModule)
  },
  {
    path: 'mutasi-hilang',
    loadChildren: () => import('./mutasi/mutasi-hilang/mutasi-hilang.module').then( m => m.MutasiHilangPageModule)
  },
  {
    path: 'mutasi-dipotong',
    loadChildren: () => import('./mutasi/mutasi-dipotong/mutasi-dipotong.module').then( m => m.MutasiDipotongPageModule)
  },
  {
    path: 'mutasidijual',
    loadChildren: () => import('./mutasi/mutasidijual/mutasidijual.module').then( m => m.MutasidijualPageModule)
  },
  {
    path: 'mutasi-pindah',
    loadChildren: () => import('./mutasi/mutasi-pindah/mutasi-pindah.module').then( m => m.MutasiPindahPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'detail-kelahiran',
    loadChildren: () => import('./buku-lahir/detail-kelahiran/detail-kelahiran.module').then( m => m.DetailKelahiranPageModule)
  },
  {
    path: 'request-kegiatan',
    loadChildren: () => import('./kegiatan/request-kegiatan/request-kegiatan.module').then( m => m.RequestKegiatanPageModule)
  },
  {
    path: 'detail-mutasi',
    loadChildren: () => import('./mutasi/detail-mutasi/detail-mutasi.module').then( m => m.DetailMutasiPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetugasRoutingModule {}