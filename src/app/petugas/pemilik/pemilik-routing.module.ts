import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PemilikPage } from './pemilik.page';

const routes: Routes = [
  {
    path: '',
    component: PemilikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PemilikPageRoutingModule {}
