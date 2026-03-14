import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingPageRoutingModule } from './setting-routing.module';
import { SettingPage } from './setting.page';
import { SharedUiModule } from '../../shared/shared-ui.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedUiModule,
    SettingPageRoutingModule,
  ],
  declarations: [SettingPage],
})
export class SettingPageModule {}
