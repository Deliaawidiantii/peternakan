import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { DetailKelahiranPageRoutingModule } from './detail-kelahiran-routing.module';

import { DetailKelahiranPage } from './detail-kelahiran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    DetailKelahiranPageRoutingModule
  ],
  declarations: [DetailKelahiranPage]
})
export class DetailKelahiranPageModule {}
