import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../shared/shared-ui.module';

import { HewanPageRoutingModule } from './hewan-routing.module';

import { HewanPage } from './hewan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    HewanPageRoutingModule
  ],
  declarations: [HewanPage]
})
export class HewanPageModule {}
