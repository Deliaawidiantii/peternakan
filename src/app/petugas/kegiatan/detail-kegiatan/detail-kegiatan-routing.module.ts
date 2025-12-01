import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailKegiatanPage } from './detail-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailKegiatanPageRoutingModule {}
