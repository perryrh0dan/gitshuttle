import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

import { GitService } from '../core/services';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {
  constructor(
    private gitService: GitService
  ) { }
}
