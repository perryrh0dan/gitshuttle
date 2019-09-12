import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MaterialModule } from './material/material.module';

// Services
import { GitService, RepositoryService, BranchService, SettingsService } from './services';

// Pipes

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [GitService, RepositoryService, BranchService, SettingsService]
})
export class CoreModule { }
