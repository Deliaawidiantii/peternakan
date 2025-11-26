import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailMutasiPageRoutingModule } from './detail-mutasi-routing.module';

import { DetailMutasiPage } from './detail-mutasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailMutasiPageRoutingModule
  ],
  declarations: [DetailMutasiPage]
})
export class DetailMutasiPageModule {}
