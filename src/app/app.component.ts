import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { SidebarService } from './core/services/sidebar.service'
import { SettingsService } from './core/services/settings.service'
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidebar', { static: true }) public sidebar: MatSidenav;
  @ViewChild('settings', { static: true }) public settings: MatSidenav;

  constructor(
    public electronService: ElectronService,
    public sidebarService: SidebarService,
    public settingsService: SettingsService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit(): void {
    this.sidebarService.setSidebar(this.sidebar);
  }
}
