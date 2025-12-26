import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputPerkawinanPage } from './input-perkawinan.page';

const routes: Routes = [
  {
    path: '',
    component: InputPerkawinanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputPerkawinanPageRoutingModule {}
