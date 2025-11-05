import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MutasiDipotongPageRoutingModule } from './mutasi-dipotong-routing.module';

import { MutasiDipotongPage } from './mutasi-dipotong.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasiDipotongPageRoutingModule
  ],
  declarations: [MutasiDipotongPage]
})
export class MutasiDipotongPageModule {}
