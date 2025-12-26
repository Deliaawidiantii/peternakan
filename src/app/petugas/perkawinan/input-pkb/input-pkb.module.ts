import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputPKBPageRoutingModule } from './input-pkb-routing.module';

import { InputPKBPage } from './input-pkb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputPKBPageRoutingModule
  ],
  declarations: [InputPKBPage]
})
export class InputPKBPageModule {}
