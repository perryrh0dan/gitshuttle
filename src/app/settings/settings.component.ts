import { Component, OnInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from '../core/services';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state('close', style({
        'margin-left': '105%'
      })),
      state('open', style({
        'margin-left': '35%'
      })),
      transition('open=>close', animate('150ms')),
      transition('close=>open', animate('150ms')),
    ]),
    trigger('changeOverlayState', [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(150, style({ opacity: 0.5 }))
      ]),
      transition(":leave", [
        animate(150, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SettingsComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  isShown: Boolean;
  isOpen: Boolean;
  currentState: String;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.isOpen.subscribe(value => {
      this.isOpen = value;
      this.currentState = value ? 'open' : 'close';
      if (this.isOpen) {
        this.isShown = true;
      } else {
        setTimeout(function () {
          this.isShown = false
        }.bind(this), 150);
      }
    })
  }

  close() {
    this.settingsService.close();
  }
}
