import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KandangPage } from './kandang.page';

const routes: Routes = [
  {
    path: '',
    component: KandangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KandangPageRoutingModule {}
