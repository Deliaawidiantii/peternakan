import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiPage } from './mutasi.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiPageRoutingModule {}
