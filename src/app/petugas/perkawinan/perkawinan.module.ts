import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerkawinanPageRoutingModule } from './perkawinan-routing.module';

import { PerkawinanPage } from './perkawinan.page';
import { EditDataPKBPage } from './edit-data-pkb/edit-data-pkb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerkawinanPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PerkawinanPage]
})
export class PerkawinanPageModule {}
