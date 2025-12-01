import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnggasPage } from './unggas.page';

const routes: Routes = [
  {
    path: '',
    component: UnggasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnggasPageRoutingModule {}
