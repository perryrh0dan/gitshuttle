import { Injectable } from '@angular/core';
@Injectable()
export class ConfigService {
  config: Object;
  constructor() { }

  loadConfig() {
    if (!this.config) {
      this.config = localStorage.getItem('config');
    }
    return this.config
  }

  setConfig(config) {
    this.config = config;
    localStorage.setItem('config', JSON.stringify(this.config));
  }
}