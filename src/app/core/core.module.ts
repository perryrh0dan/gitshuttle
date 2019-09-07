import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MaterialModule } from './material/material.module';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Services
import { GitService } from './services';
import { RepositoryService } from './services';
import { SettingsService } from './services';
import { SidebarService } from './services';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    FontAwesomeModule,
    TabsModule,
    TooltipModule
  ],
  providers: [GitService, RepositoryService, SettingsService, SidebarService]
})
export class CoreModule { }
