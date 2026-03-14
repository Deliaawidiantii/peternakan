import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedUiModule } from '../../../shared/shared-ui.module';

import { UpdateStatusPenyakitPageRoutingModule } from './update-status-penyakit-routing.module';

import { UpdateStatusPenyakitPage } from './update-status-penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedUiModule,
    UpdateStatusPenyakitPageRoutingModule
  ],
  declarations: [UpdateStatusPenyakitPage]
})
export class UpdateStatusPenyakitPageModule {}
