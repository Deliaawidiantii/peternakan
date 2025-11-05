import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KesayanganPage } from './kesayangan.page';

const routes: Routes = [
  {
    path: '',
    component: KesayanganPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KesayanganPageRoutingModule {}
