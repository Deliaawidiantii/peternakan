import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';  // ← Tambah ini

import { PetugasRoutingModule } from './petugas-routing.module';
import { HewanPageModule } from './hewan/hewan.module';
import { DataHewanPage } from './hewan/data-hewan/data-hewan.page';

@NgModule({
  declarations: [
    
    // komponen lainnya
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,  // ← Tambah di sini
    PetugasRoutingModule,
    HewanPageModule,
    DataHewanPage,
  ],
})
export class PetugasModule { }