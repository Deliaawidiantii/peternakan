import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailRiwayatPerkawinanPageRoutingModule } from './detail-riwayat-perkawinan-routing.module';

import { DetailRiwayatPerkawinanPage } from './detail-riwayat-perkawinan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailRiwayatPerkawinanPageRoutingModule
  ],
  declarations: [DetailRiwayatPerkawinanPage]
})
export class DetailRiwayatPerkawinanPageModule {}
