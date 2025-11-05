import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaporanKasusPenyakitPageRoutingModule } from './laporan-kasus-penyakit-routing.module';

import { LaporanKasusPenyakitPage } from './laporan-kasus-penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaporanKasusPenyakitPageRoutingModule
  ],
  declarations: [LaporanKasusPenyakitPage]
})
export class LaporanKasusPenyakitPageModule {}
