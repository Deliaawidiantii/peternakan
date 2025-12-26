import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatPerkawinanPage } from './riwayat-perkawinan.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatPerkawinanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatPerkawinanPageRoutingModule {}
