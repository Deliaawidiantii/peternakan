import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataKandangPageRoutingModule } from './data-kandang-routing.module';

import { DataKandangPage } from './data-kandang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataKandangPageRoutingModule
  ],
  declarations: [DataKandangPage]
})
export class DataKandangPageModule {}
