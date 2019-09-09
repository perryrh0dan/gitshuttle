import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';


// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

import { CommitsComponent } from './commits/commits.component';
import { MainComponent } from './main/main.component';
import { CreateCommitComponent } from './create-commit/create-commit.component';

@NgModule({
  declarations: [HomeComponent, CommitsComponent, MainComponent, CreateCommitComponent],
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
