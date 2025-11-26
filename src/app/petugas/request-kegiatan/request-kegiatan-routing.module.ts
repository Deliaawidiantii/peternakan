import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestKegiatanPage } from './request-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: RequestKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestKegiatanPageRoutingModule {}
