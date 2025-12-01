import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailKegiatanPageRoutingModule } from './detail-kegiatan-routing.module';

import { DetailKegiatanPage } from './detail-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailKegiatanPageRoutingModule
  ],
  declarations: [DetailKegiatanPage]
})
export class DetailPetugasPageModule {}
