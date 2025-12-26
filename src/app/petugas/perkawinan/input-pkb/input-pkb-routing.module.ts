import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputPKBPage } from './input-pkb.page';

const routes: Routes = [
  {
    path: '',
    component: InputPKBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputPKBPageRoutingModule {}
