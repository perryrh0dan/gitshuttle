import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { AddRepositoryComponent } from './components/add-repository/add-repository.component';

@NgModule({
  declarations: [
    PageNotFoundComponent, 
    WebviewDirective, 
    AddRepositoryComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    TabsModule.forRoot()
  ],
  exports: [
    TranslateModule,
    WebviewDirective
  ],
  entryComponents: [
    AddRepositoryComponent
  ]
})
export class SharedModule { }
