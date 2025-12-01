import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPemilikPageRoutingModule } from './detail-pemilik-routing.module';

import { DetailPemilikPage } from './detail-pemilik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPemilikPageRoutingModule
  ],
  declarations: [DetailPemilikPage]
})
export class DetailPemilikPageModule {}
