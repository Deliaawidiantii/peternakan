import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MutasiMatiPageRoutingModule } from './mutasi-mati-routing.module';

import { MutasiMatiPage } from './mutasi-mati.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasiMatiPageRoutingModule
  ],
  declarations: [MutasiMatiPage]
})
export class MutasiMatiPageModule {}
