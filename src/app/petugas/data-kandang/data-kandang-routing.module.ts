import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataKandangPage } from './data-kandang.page';

const routes: Routes = [
  {
    path: '',
    component: DataKandangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataKandangPageRoutingModule {}
