import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerkawinanPage } from './perkawinan.page';

const routes: Routes = [
  {
    path: '',
    component: PerkawinanPage
  },  {
    path: 'input-perkawinan',
    loadChildren: () => import('./input-perkawinan/input-perkawinan.module').then( m => m.InputPerkawinanPageModule)
  },
  {
    path: 'pkb',
    loadChildren: () => import('./pkb/pkb.module').then( m => m.PKBPageModule)
  },
  {
    path: 'detail-pkb',
    loadChildren: () => import('./detail-pkb/detail-pkb.module').then( m => m.DetailPKBPageModule)
  },
  {
    path: 'edit-data-pkb',
    loadChildren: () => import('./edit-data-pkb/edit-data-pkb.module').then( m => m.EditDataPKBPageModule)
  },
  {
    path: 'input-pkb',
    loadChildren: () => import('./input-pkb/input-pkb.module').then( m => m.InputPKBPageModule)
  },
  {
    path: 'riwayat-perkawinan',
    loadChildren: () => import('./riwayat-perkawinan/riwayat-perkawinan.module').then( m => m.RiwayatPerkawinanPageModule)
  },
  {
    path: 'lahir',
    loadChildren: () => import('./lahir/lahir.module').then( m => m.LahirPageModule)
  },
  {
    path: 'detail-riwayat-perkawinan',
    loadChildren: () => import('./detail-riwayat-perkawinan/detail-riwayat-perkawinan.module').then( m => m.DetailRiwayatPerkawinanPageModule)
  },
  {
    path: 'akta-lahir',
    loadChildren: () => import('./akta-lahir/akta-lahir.module').then( m => m.AktaLahirPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerkawinanPageRoutingModule {}
