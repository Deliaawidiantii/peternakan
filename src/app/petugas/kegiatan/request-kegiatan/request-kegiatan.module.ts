import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { RequestKegiatanPageRoutingModule } from './request-kegiatan-routing.module';

import { RequestKegiatanPage } from './request-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedUiModule,
    RequestKegiatanPageRoutingModule
  ],
  declarations: [RequestKegiatanPage]
})
export class RequestKegiatanPageModule {}
