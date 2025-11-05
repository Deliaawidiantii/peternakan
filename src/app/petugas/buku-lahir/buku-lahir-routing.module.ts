import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BukuLahirPage } from './buku-lahir.page';

const routes: Routes = [
  {
    path: '',
    component: BukuLahirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BukuLahirPageRoutingModule {}
