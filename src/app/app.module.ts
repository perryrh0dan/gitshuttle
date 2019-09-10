import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { loadingReducer } from './reducers/loading.reducer';
import { sidebarReducer } from './reducers/sidebar.reducer';
import { settingsReducer } from './reducers/settings.reducer';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './core/material/material.module'

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MainModule } from './main/main.module'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component'
import { SettingsComponent } from './settings/settings.component';

// Test
import { AddRepositoryComponent } from './shared/components';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, NavbarComponent, SidebarComponent, SettingsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MaterialModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CoreModule,
    SharedModule,
    MainModule,
    StoreModule.forRoot({
      loading: loadingReducer,
      sidebar: sidebarReducer,
      settings: settingsReducer
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddRepositoryComponent
  ]
})
export class AppModule { }
