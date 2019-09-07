import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { AddRepositoryComponent } from './components/add-repository/add-repository.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, AddRepositoryComponent],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule, WebviewDirective],
  entryComponents: [
    AddRepositoryComponent
  ]
})
export class SharedModule {}
