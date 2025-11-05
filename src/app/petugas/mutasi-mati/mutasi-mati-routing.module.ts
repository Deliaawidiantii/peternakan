import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiMatiPage } from './mutasi-mati.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiMatiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiMatiPageRoutingModule {}
