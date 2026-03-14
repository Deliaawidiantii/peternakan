import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../shared/shared-ui.module';

import { PemilikPageRoutingModule } from './pemilik-routing.module';

import { PemilikPage } from './pemilik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    PemilikPageRoutingModule
  ],
  declarations: [PemilikPage]
})
export class PemilikPageModule {}
