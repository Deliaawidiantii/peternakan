import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataHewanPageRoutingModule } from './data-hewan-routing.module';

import { DataHewanPage } from './data-hewan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataHewanPageRoutingModule
  ],
  declarations: [DataHewanPage]
})
export class DataHewanPageModule {}
