import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataPemilikPage } from './data-pemilik.page';

const routes: Routes = [
  {
    path: '',
    component: DataPemilikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPemilikPageRoutingModule {}
