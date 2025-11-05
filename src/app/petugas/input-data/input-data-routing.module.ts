import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputDataPage } from './input-data.page';

const routes: Routes = [
  {
    path: '',
    component: InputDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputDataPageRoutingModule {}
