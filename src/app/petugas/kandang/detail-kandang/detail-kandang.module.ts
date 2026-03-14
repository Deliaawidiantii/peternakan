import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { DetailKandangPageRoutingModule } from './detail-kandang-routing.module';

import { DetailKandangPage } from './detail-kandang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    DetailKandangPageRoutingModule
  ],
  declarations: [DetailKandangPage]
})
export class DetailKandangPageModule {}
