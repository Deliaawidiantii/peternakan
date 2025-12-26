import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPKBPageRoutingModule } from './detail-pkb-routing.module';

import { DetailPKBPage } from './detail-pkb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPKBPageRoutingModule
  ],
  declarations: [DetailPKBPage]
})
export class DetailPKBPageModule {}
