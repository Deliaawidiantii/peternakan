import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestKegiatanPageRoutingModule } from './request-kegiatan-routing.module';

import { RequestKegiatanPage } from './request-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RequestKegiatanPageRoutingModule
  ],
  declarations: [RequestKegiatanPage]
})
export class RequestKegiatanPageModule {}
