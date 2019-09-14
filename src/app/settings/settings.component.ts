import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { GitService } from '../core/services';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { close } from '../actions/settings.actions';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../core/services/config/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state(
        'close',
        style({
          'margin-left': '105%'
        })
      ),
      state(
        'open',
        style({
          'margin-left': '35%'
        })
      ),
      transition('open=>close', animate('150ms')),
      transition('close=>open', animate('150ms'))
    ]),
    trigger('changeOverlayState', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(150, style({ opacity: 0.5 }))
      ]),
      transition(':leave', [animate(150, style({ opacity: 0 }))])
    ])
  ]
})
export class SettingsComponent implements OnInit {
  faArrowLeft = faArrowLeft;

  languages = [
    { text: 'English', value: 'en' },
    { text: 'German', value: 'de' }
  ];

  isShown: Boolean;
  isOpen$: Observable<Boolean>;
  currentState: String;
  selectedLanguage: String;

  globalGitConfig: {};
  localGitConfig: {};

  constructor(
    private store: Store<{ sidebar: Boolean }>,
    private gitService: GitService,
    private settingsService: SettingsService
  ) {
    this.isOpen$ = this.store.pipe(select('settings'));
  }

  ngOnInit() {
    this.isOpen$.subscribe(value => {
      this.currentState = value ? 'open' : 'close';
      if (value) {
        this.isShown = true;
      } else {
        setTimeout(
          function() {
            this.isShown = false;
          }.bind(this),
          150
        );
      }
    });
    this.getCurrentLanguage();
  }

  load() {
    this.gitService.getGlobalConfigs().then(config => {
      this.globalGitConfig = config;
    });
    this.gitService.getLocalConfigs().then(config => {
      this.localGitConfig = config;
    });
  }

  getCurrentLanguage() {
    const config = this.settingsService.getConfig();
    this.selectedLanguage = config.language;
  }

  changeAppLanguage(language) {
    const config = this.settingsService.getConfig();
    config.language = language;
    this.settingsService.setAppLanguage(language);
    this.settingsService.setConfig(config);
  }

  close() {
    this.store.dispatch(close());
  }
}
