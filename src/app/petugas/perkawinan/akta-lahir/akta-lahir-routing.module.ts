import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AktaLahirPage } from './akta-lahir.page';

const routes: Routes = [
  {
    path: '',
    component: AktaLahirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AktaLahirPageRoutingModule {}
