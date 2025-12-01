import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuminansiaPage } from './ruminansia.page';

const routes: Routes = [
  {
    path: '',
    component: RuminansiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuminansiaPageRoutingModule {}
