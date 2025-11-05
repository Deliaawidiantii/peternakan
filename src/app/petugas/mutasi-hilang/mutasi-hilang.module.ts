import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MutasiHilangPageRoutingModule } from './mutasi-hilang-routing.module';

import { MutasiHilangPage } from './mutasi-hilang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasiHilangPageRoutingModule
  ],
  declarations: [MutasiHilangPage]
})
export class MutasiHilangPageModule {}
