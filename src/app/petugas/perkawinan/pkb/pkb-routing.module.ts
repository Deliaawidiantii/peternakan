import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PKBPage } from './pkb.page';

const routes: Routes = [
  {
    path: '',
    component: PKBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PKBPageRoutingModule {}
