import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateStatusPenyakitPage } from './update-status-penyakit.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateStatusPenyakitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateStatusPenyakitPageRoutingModule {}
