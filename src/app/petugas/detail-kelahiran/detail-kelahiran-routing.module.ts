import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailKelahiranPage } from './detail-kelahiran.page';

const routes: Routes = [
  {
    path: '',
    component: DetailKelahiranPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailKelahiranPageRoutingModule {}
