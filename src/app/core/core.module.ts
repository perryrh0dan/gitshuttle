import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MaterialModule } from './material/material.module';

// Services
import { AppService } from './services'
import { GitService } from './services';
import { RepositoryService } from './services';
import { SettingsService } from './services';
import { SidebarService } from './services';
import { BranchService } from './services';

// Pipes

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [AppService, GitService, RepositoryService, SettingsService, SidebarService, BranchService]
})
export class CoreModule { }
