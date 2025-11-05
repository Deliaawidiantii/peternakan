import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateStatusPenyakitPageRoutingModule } from './update-status-penyakit-routing.module';

import { UpdateStatusPenyakitPage } from './update-status-penyakit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateStatusPenyakitPageRoutingModule
  ],
  declarations: [UpdateStatusPenyakitPage]
})
export class UpdateStatusPenyakitPageModule {}
