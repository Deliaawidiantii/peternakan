import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailKelahiranPageRoutingModule } from './detail-kelahiran-routing.module';

import { DetailKelahiranPage } from './detail-kelahiran.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailKelahiranPageRoutingModule
  ],
  declarations: [DetailKelahiranPage]
})
export class DetailKelahiranPageModule {}
