import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { DetailHewanPageRoutingModule } from './detail-hewan-routing.module';

import { DetailHewanPage } from './detail-hewan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedUiModule,
    DetailHewanPageRoutingModule
  ],
  declarations: [DetailHewanPage]
})
export class DetailHewanPageModule {}
