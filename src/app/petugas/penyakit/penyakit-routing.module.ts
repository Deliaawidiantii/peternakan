import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenyakitPage } from './penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: PenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenyakitPageRoutingModule {}
