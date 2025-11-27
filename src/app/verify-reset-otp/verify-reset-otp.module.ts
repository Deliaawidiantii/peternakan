import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyResetOtpPageRoutingModule } from './verify-reset-otp-routing.module';

import { VerifyResetOtpPage } from './verify-reset-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyResetOtpPageRoutingModule
  ],
  declarations: [VerifyResetOtpPage]
})
export class VerifyResetOtpPageModule {}
