import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { RiwayatKegiatanPageRoutingModule } from './riwayat-kegiatan-routing.module';

import { RiwayatKegiatanPage } from './riwayat-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    RiwayatKegiatanPageRoutingModule
  ],
  declarations: [RiwayatKegiatanPage]
})
export class RiwayatKegiatanPageModule {}
