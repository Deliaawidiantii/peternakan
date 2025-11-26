import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailMutasiPage } from './detail-mutasi.page';

const routes: Routes = [
  {
    path: '',
    component: DetailMutasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailMutasiPageRoutingModule {}
