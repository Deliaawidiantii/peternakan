import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPemilikPageRoutingModule } from './data-pemilik-routing.module';

import { DataPemilikPage } from './data-pemilik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPemilikPageRoutingModule
  ],
  declarations: [DataPemilikPage]
})
export class DataPemilikPageModule {}
