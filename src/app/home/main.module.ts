import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './main-routing.module';

import { MainComponent } from './main.component';
import { SharedModule } from '../shared/shared.module';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

import { CommitsComponent } from './commits/commits.component';
import { CreateCommitComponent } from './create-commit/create-commit.component';

@NgModule({
  declarations: [MainComponent, CommitsComponent, CreateCommitComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FontAwesomeModule,
    TabsModule.forRoot()
  ]
})
export class HomeModule {
  constructor() { }
}
