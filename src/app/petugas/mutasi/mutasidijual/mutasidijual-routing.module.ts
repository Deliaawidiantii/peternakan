import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasidijualPage } from './mutasidijual.page';

const routes: Routes = [
  {
    path: '',
    component: MutasidijualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasidijualPageRoutingModule {}
