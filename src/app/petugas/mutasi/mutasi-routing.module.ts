import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MutasiPage } from './mutasi.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiPage
  },  {
    path: 'edit-mutasi',
    loadChildren: () => import('./edit-mutasi/edit-mutasi.module').then( m => m.EditMutasiPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MutasiPageRoutingModule {}
