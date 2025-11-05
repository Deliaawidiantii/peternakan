import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HewanPage } from './hewan.page';

const routes: Routes = [
  {
    path: '',
    component: HewanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HewanPageRoutingModule {}
