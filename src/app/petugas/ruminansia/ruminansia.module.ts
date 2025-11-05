import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuminansiaPageRoutingModule } from './ruminansia-routing.module';

import { RuminansiaPage } from './ruminansia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuminansiaPageRoutingModule
  ],
  declarations: [RuminansiaPage]
})
export class RuminansiaPageModule {}
