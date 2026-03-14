import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JadwalKegiatanPageRoutingModule } from './jadwal-kegiatan-routing.module';

import { JadwalKegiatanPage } from './jadwal-kegiatan.page';
import { SharedUiModule } from '../../../shared/shared-ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    JadwalKegiatanPageRoutingModule
  ],
  declarations: [JadwalKegiatanPage]
})
export class JadwalKegiatanPageModule {}
