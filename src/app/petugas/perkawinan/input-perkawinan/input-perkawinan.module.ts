import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputPerkawinanPageRoutingModule } from './input-perkawinan-routing.module';

import { InputPerkawinanPage } from './input-perkawinan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputPerkawinanPageRoutingModule
  ],
  declarations: [InputPerkawinanPage]
})
export class InputPerkawinanPageModule {}
