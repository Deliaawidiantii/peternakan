import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiwayatKegiatanPageRoutingModule } from './riwayat-kegiatan-routing.module';

import { RiwayatKegiatanPage } from './riwayat-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatKegiatanPageRoutingModule
  ],
  declarations: [RiwayatKegiatanPage]
})
export class RiwayatKegiatanPageModule {}
