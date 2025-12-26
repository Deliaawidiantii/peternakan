import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDataPKBPage } from './edit-data-pkb.page';

const routes: Routes = [
  {
    path: '',
    component: EditDataPKBPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDataPKBPageRoutingModule {}
