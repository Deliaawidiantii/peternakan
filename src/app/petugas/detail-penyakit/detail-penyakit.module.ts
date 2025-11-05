import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPenyakitPageRoutingModule } from './detail-penyakit-routing.module';

import { DetailPenyakitPage } from './detail-penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPenyakitPageRoutingModule
  ],
  declarations: [DetailPenyakitPage]
})
export class DetailPenyakitPageModule {}
