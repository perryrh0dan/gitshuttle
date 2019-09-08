import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

import { GitService } from '../core/services';
import { CommitsComponent } from './commits/commits.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [HomeComponent, CommitsComponent, MainComponent],
  imports: [
    CommonModule, 
    SharedModule, 
    HomeRoutingModule,
    TabsModule.forRoot()
  ]
})
export class HomeModule {
  constructor(
    private gitService: GitService
  ) { }
}
