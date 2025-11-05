import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BukuLahirPageRoutingModule } from './buku-lahir-routing.module';

import { BukuLahirPage } from './buku-lahir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BukuLahirPageRoutingModule
  ],
  declarations: [BukuLahirPage]
})
export class BukuLahirPageModule {}
