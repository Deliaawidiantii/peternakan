import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailHewanPage } from './detail-hewan.page';

const routes: Routes = [
  {
    path: '',
    component: DetailHewanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailHewanPageRoutingModule {}
