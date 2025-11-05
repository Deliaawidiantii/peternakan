import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataHewanPage } from './data-hewan.page';

const routes: Routes = [
  {
    path: '',
    component: DataHewanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataHewanPageRoutingModule {}
