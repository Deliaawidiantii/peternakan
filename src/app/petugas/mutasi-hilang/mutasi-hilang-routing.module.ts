import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiHilangPage } from './mutasi-hilang.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiHilangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiHilangPageRoutingModule {}
