import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaftarPenyakitPageRoutingModule } from './daftar-penyakit-routing.module';

import { DaftarPenyakitPage } from './daftar-penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaftarPenyakitPageRoutingModule
  ],
  declarations: [DaftarPenyakitPage]
})
export class DaftarPenyakitPageModule {}
