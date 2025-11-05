import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatKegiatanPage } from './riwayat-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatKegiatanPageRoutingModule {}
