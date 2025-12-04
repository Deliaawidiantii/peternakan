import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMutasiPageRoutingModule } from './edit-mutasi-routing.module';

import { EditMutasiPage } from './edit-mutasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditMutasiPageRoutingModule
  ],
  declarations: [EditMutasiPage]
})
export class EditMutasiPageModule {}
