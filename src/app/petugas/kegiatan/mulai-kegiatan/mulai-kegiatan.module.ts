import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { MulaiKegiatanPageRoutingModule } from './mulai-kegiatan-routing.module';

import { MulaiKegiatanPage } from './mulai-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    MulaiKegiatanPageRoutingModule
  ],
  declarations: [MulaiKegiatanPage]
})
export class MulaiKegiatanPageModule {}
