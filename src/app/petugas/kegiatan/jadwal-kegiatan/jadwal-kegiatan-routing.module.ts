import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JadwalKegiatanPage } from './jadwal-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: JadwalKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JadwalKegiatanPageRoutingModule {}
