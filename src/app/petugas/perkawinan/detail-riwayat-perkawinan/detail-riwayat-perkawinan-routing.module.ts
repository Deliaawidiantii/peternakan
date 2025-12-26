import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailRiwayatPerkawinanPage } from './detail-riwayat-perkawinan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailRiwayatPerkawinanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRiwayatPerkawinanPageRoutingModule {}
