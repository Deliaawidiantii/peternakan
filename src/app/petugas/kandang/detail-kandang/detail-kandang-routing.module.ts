import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailKandangPage } from './detail-kandang.page';

const routes: Routes = [
  {
    path: ':id',
    component: DetailKandangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailKandangPageRoutingModule {}
