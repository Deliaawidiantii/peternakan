import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatPerkembanganPenyakitPage } from './riwayat-perkembangan-penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatPerkembanganPenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatPerkembanganPenyakitPageRoutingModule {}
