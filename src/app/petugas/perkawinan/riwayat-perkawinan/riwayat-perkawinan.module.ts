import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiwayatPerkawinanPageRoutingModule } from './riwayat-perkawinan-routing.module';

import { RiwayatPerkawinanPage } from './riwayat-perkawinan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatPerkawinanPageRoutingModule
  ],
  declarations: [RiwayatPerkawinanPage]
})
export class RiwayatPerkawinanPageModule {}
