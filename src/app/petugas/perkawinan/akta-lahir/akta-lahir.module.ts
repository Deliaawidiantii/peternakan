import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AktaLahirPageRoutingModule } from './akta-lahir-routing.module';

import { AktaLahirPage } from './akta-lahir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AktaLahirPageRoutingModule
  ],
  declarations: [AktaLahirPage]
})
export class AktaLahirPageModule {}
