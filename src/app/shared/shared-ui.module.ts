import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PageHeaderComponent } from './ui/page-header/page-header.component';
import { LoadingStateComponent } from './ui/loading-state/loading-state.component';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
})
export class SharedUiModule {}
