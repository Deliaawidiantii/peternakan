import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BukuLahirPage } from './buku-lahir.page';

const routes: Routes = [
  {
    path: '',
    component: BukuLahirPage
  },  {
    path: 'edit-buku-lahir',
    loadChildren: () => import('./edit-buku-lahir/edit-buku-lahir.module').then( m => m.EditBukuLahirPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BukuLahirPageRoutingModule {}
