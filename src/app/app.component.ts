import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService, SettingsService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { MatSidenav } from '@angular/material';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidebar', { static: true }) public sidebar: MatSidenav;

  sidebarIsOpen$: Observable<Boolean>;
  sidebarIsOpen: Boolean;

  constructor(
    public electronService: ElectronService,
    private settingsService: SettingsService,
    private store: Store<{ sidebar: Boolean }>
  ) {
    console.log('environment', environment);
    this.settingsService.setAppLanguage();

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.sidebarIsOpen$ = this.store.pipe(select('sidebar'));
    this.sidebarIsOpen$.subscribe(value => {
      if (this.sidebar) {
        this.sidebar.toggle();
      }
    });
  }
}
