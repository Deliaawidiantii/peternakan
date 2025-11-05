import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiPindahPage } from './mutasi-pindah.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiPindahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiPindahPageRoutingModule {}
