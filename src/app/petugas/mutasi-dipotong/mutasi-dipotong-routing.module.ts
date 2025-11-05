import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiDipotongPage } from './mutasi-dipotong.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiDipotongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiDipotongPageRoutingModule {}
