import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiwayatPerkembanganPenyakitPageRoutingModule } from './riwayat-perkembangan-penyakit-routing.module';

import { RiwayatPerkembanganPenyakitPage } from './riwayat-perkembangan-penyakit.page';


import { ComponentsModule } from './components.module';
import { SharedUiModule } from '../../shared/shared-ui.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatPerkembanganPenyakitPageRoutingModule,
    ComponentsModule,
    SharedUiModule,
    
  ],
  declarations: [RiwayatPerkembanganPenyakitPage]
})
export class RiwayatPerkembanganPenyakitPageModule {}
