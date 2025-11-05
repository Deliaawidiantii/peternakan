import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformasiPage } from './informasi.page';

const routes: Routes = [
  {
    path: '',
    component: InformasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformasiPageRoutingModule {}
