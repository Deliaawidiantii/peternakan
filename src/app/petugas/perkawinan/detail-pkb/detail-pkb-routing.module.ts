import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPKBPage } from './detail-pkb.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPKBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPKBPageRoutingModule {}
