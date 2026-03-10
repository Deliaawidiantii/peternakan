import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

const routes: Routes = [

   {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
   path: 'petugas',
    canActivate: [authGuard],
    loadChildren: () => import('./petugas/petugas.module').then(m => m.PetugasModule) 
  },

  {
    path: 'login',
    canActivate: [publicGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

 
  {
    path: 'register',
    canActivate: [publicGuard],
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    canActivate: [publicGuard],
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    canActivate: [publicGuard],
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'otp-verify',
    canActivate: [publicGuard],
    loadChildren: () => import('./otp-verify/otp-verify.module').then( m => m.OtpVerifyPageModule)
  },
  {
    path: 'verify-reset-otp',
    canActivate: [publicGuard],
    loadChildren: () => import('./verify-reset-otp/verify-reset-otp.module').then( m => m.VerifyResetOtpPageModule)
  },


 

  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
