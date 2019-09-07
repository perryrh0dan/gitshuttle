import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './core/material/material.module'

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { SidebarService } from './core/services';
import { GitService } from './core/services';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './core/services';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, NavbarComponent, SidebarLeftComponent, SettingsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FontAwesomeModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [SidebarService, SettingsService, GitService],
  bootstrap: [AppComponent]
})
export class AppModule {}
