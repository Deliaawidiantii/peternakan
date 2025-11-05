import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrimataPageRoutingModule } from './primata-routing.module';

import { PrimataPage } from './primata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrimataPageRoutingModule
  ],
  declarations: [PrimataPage]
})
export class PrimataPageModule {}
