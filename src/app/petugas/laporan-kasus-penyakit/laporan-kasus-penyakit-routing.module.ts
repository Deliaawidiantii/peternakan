import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaporanKasusPenyakitPage } from './laporan-kasus-penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: LaporanKasusPenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaporanKasusPenyakitPageRoutingModule {}
