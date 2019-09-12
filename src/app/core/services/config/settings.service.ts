import { Injectable } from '@angular/core';
import { Settings } from '../../models';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class SettingsService {
  config: Settings;
  constructor(private translateService: TranslateService) {
    const configJson = localStorage.getItem('config');
    if (configJson) {
      this.config = new Settings().deserialize(JSON.parse(configJson));
    } else {
      this.config = new Settings();
    }
  }

  getConfig() {
    return this.config;
  }

  setConfig(config) {
    this.config = config;
    localStorage.setItem('config', JSON.stringify(this.config));
  }

  setAppLanguage(language?: string) {
    if (!language) {
      language = this.config.language;
    }
    this.translateService.setDefaultLang(language);
  }
}
