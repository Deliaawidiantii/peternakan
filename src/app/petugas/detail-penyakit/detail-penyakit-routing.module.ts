import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPenyakitPage } from './detail-penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPenyakitPageRoutingModule {}
