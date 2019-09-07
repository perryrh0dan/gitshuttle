import { Component, OnInit } from '@angular/core';
import { faPlus, faCog, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../core/services/sidebar/sidebar.service';
import { GitService } from '../core/services';
import { SettingsService } from '../core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faPlus = faPlus;
  faCog = faCog;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  sidebarIsOpen: Boolean;
  currentBranch: String;

  constructor(
    private sidebarService: SidebarService,
    private settingsService: SettingsService,
    private gitService: GitService
  ) { 
    this.sidebarService.isOpen.subscribe(value => {
      this.sidebarIsOpen = value;
    })
    this.gitService.currentBranch.subscribe(value => {
      this.currentBranch = value;
    })
  }

  ngOnInit() {
    this.sidebarService.isOpen
  }

  toggleLeftSidenav() {
    this.sidebarService.toggle();

    console.log('Clicked');
  }

  showSettings() {
    this.settingsService.open();
  }
}
