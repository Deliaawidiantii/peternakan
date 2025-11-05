import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KesayanganPageRoutingModule } from './kesayangan-routing.module';

import { KesayanganPage } from './kesayangan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KesayanganPageRoutingModule
  ],
  declarations: [KesayanganPage]
})
export class KesayanganPageModule {}
