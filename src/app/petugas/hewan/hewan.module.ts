import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HewanPageRoutingModule } from './hewan-routing.module';

import { HewanPage } from './hewan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HewanPageRoutingModule
  ],
  declarations: [HewanPage]
})
export class HewanPageModule {}
