import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MutasiPindahPageRoutingModule } from './mutasi-pindah-routing.module';

import { MutasiPindahPage } from './mutasi-pindah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasiPindahPageRoutingModule
  ],
  declarations: [MutasiPindahPage]
})
export class MutasiPindahPageModule {}
