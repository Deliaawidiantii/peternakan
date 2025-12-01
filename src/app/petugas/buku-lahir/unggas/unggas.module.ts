import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnggasPageRoutingModule } from './unggas-routing.module';

import { UnggasPage } from './unggas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnggasPageRoutingModule
  ],
  declarations: [UnggasPage]
})
export class UnggasPageModule {}
