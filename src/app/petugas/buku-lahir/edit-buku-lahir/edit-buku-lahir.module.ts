import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditBukuLahirPageRoutingModule } from './edit-buku-lahir-routing.module';
import { EditBukuLahirPage } from './edit-buku-lahir.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    EditBukuLahirPageRoutingModule
  ],
  declarations: [EditBukuLahirPage]
})
export class EditBukuLahirPageModule { }