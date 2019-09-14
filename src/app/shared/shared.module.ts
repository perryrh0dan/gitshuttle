import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { AddRepositoryComponent } from './components/add-repository/add-repository.component';
import { RepoFilterPipe, SanitizeHtmlPipe, TruncatePipe } from './pipes';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    AddRepositoryComponent,
    RepoFilterPipe,
    SanitizeHtmlPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    TabsModule.forRoot()
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    RepoFilterPipe,
    SanitizeHtmlPipe,
    TruncatePipe
  ],
  entryComponents: [
    AddRepositoryComponent
  ]
})
export class SharedModule { }
