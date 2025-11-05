import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MulaiKegiatanPage } from './mulai-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: MulaiKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MulaiKegiatanPageRoutingModule {}
