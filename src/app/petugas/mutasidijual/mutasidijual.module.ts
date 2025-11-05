import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MutasidijualPageRoutingModule } from './mutasidijual-routing.module';

import { MutasidijualPage } from './mutasidijual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MutasidijualPageRoutingModule
  ],
  declarations: [MutasidijualPage]
})
export class MutasidijualPageModule {}
