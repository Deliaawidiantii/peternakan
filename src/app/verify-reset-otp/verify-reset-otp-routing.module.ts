import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyResetOtpPage } from './verify-reset-otp.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyResetOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyResetOtpPageRoutingModule {}
