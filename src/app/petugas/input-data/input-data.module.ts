import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputDataPageRoutingModule } from './input-data-routing.module';

import { InputDataPage } from './input-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputDataPageRoutingModule,
   
  ],
  declarations: [ InputDataPage]
})
export class InputDataPageModule {}
