import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditBukuLahirPage } from './edit-buku-lahir.page';

const routes: Routes = [
  {
    path: '',
    component: EditBukuLahirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditBukuLahirPageRoutingModule { }