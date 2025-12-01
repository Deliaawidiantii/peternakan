import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrimataPage } from './primata.page';

const routes: Routes = [
  {
    path: '',
    component: PrimataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrimataPageRoutingModule {}
