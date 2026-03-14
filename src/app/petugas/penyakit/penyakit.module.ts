import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../shared/shared-ui.module';

import { PenyakitPageRoutingModule } from './penyakit-routing.module';

import { PenyakitPage } from './penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    PenyakitPageRoutingModule
  ],
  declarations: [PenyakitPage]
})
export class PenyakitPageModule {}
