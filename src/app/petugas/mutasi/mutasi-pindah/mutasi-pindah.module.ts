import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { MutasiPindahPageRoutingModule } from './mutasi-pindah-routing.module';

import { MutasiPindahPage } from './mutasi-pindah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    MutasiPindahPageRoutingModule
  ],
  declarations: [MutasiPindahPage]
})
export class MutasiPindahPageModule {}
