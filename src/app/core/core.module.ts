import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MaterialModule } from './material/material.module';

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
  ],
  providers: [GitService, RepositoryService, SettingsService, SidebarService]
})
export class CoreModule { }
