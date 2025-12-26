import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PKBPageRoutingModule } from './pkb-routing.module';

import { PKBPage } from './pkb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PKBPageRoutingModule
  ],
  declarations: [PKBPage]
})
export class PKBPageModule {}
