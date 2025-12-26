import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LahirPage } from './lahir.page';

const routes: Routes = [
  {
    path: '',
    component: LahirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LahirPageRoutingModule {}
