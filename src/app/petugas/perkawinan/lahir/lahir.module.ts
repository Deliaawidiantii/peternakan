import { NgModule } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LahirPageRoutingModule } from './lahir-routing.module';

import { LahirPage } from './lahir.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '../../../shared/shared-ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LahirPageRoutingModule,
    ReactiveFormsModule,
    SharedUiModule
  ],
  declarations: [LahirPage]
})
export class LahirPageModule {}
