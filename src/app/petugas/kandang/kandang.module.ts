import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../shared/shared-ui.module';

import { KandangPageRoutingModule } from './kandang-routing.module';

import { KandangPage } from './kandang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    KandangPageRoutingModule
  ],
  declarations: [KandangPage]
})
export class KandangPageModule {}
