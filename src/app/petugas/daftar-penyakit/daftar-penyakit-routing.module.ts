import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaftarPenyakitPage } from './daftar-penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: DaftarPenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaftarPenyakitPageRoutingModule {}
