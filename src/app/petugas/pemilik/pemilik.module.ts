import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PemilikPageRoutingModule } from './pemilik-routing.module';

import { PemilikPage } from './pemilik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PemilikPageRoutingModule
  ],
  declarations: [PemilikPage]
})
export class PemilikPageModule {}
