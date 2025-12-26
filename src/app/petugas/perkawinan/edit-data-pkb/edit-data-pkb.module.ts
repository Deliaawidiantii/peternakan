import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDataPKBPageRoutingModule } from './edit-data-pkb-routing.module';

import { EditDataPKBPage } from './edit-data-pkb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDataPKBPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDataPKBPage]
})
export class EditDataPKBPageModule {}
