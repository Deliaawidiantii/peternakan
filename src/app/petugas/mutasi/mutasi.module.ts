import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MutasiPageRoutingModule } from './mutasi-routing.module';

import { MutasiPage } from './mutasi.page';

const routes: Routes = [
  {
    path: '',
    component: MutasiPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasiPageRoutingModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [MutasiPage]
})
export class MutasiPageModule {}
