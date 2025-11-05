import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// Import semua komponen yang kamu buat di folder ini
import { TerdiagnosaComponent } from './components/terdiagnosa/terdiagnosa.component';
import { DalamPerkembanganComponent } from './components/dalam-perkembangan/dalam-perkembangan.component';
import { MatiComponent } from './components/mati/mati.component';
import { SembuhComponent } from './components/sembuh/sembuh.component';
import { SelesaiComponent } from './components/selesai/selesai.component';




@NgModule({
  declarations: [
    TerdiagnosaComponent,
    DalamPerkembanganComponent,
    MatiComponent,
    SembuhComponent,
    SelesaiComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule

  ],
  exports: [
    TerdiagnosaComponent,
    DalamPerkembanganComponent,
    MatiComponent,
    SembuhComponent,
    SelesaiComponent

  ]
})
export class ComponentsModule {}
