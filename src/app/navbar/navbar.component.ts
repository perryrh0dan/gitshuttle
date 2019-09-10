import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { faPlus, faCog, faToggleOn, faToggleOff, faSync, faCodeBranch, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { SidebarService } from '../core/services/sidebar/sidebar.service';
import { GitService } from '../core/services';
import { SettingsService } from '../core/services';

import { AddRepositoryComponent } from '../shared/components';
import { BranchService } from '../core/services/branch/branch.service';
import { AppService } from '../core/services/app/app.service';

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
  faSync = faSync;
  faCodeBranch = faCodeBranch;
  faChevronUp = faChevronUp;

  isLoading: Boolean;
  sidebarIsOpen: Boolean;
  currentBranch: String;

  constructor(
    private appService: AppService,
    private sidebarService: SidebarService,
    private settingsService: SettingsService,
    private branchService: BranchService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.appService.isLoading.subscribe(value => {
      this.isLoading = value;
    })
    this.sidebarService.isOpen.subscribe(value => {
      this.sidebarIsOpen = value;
    })
    this.branchService.currentBranch.subscribe(value => {
      this.currentBranch = value;
    })
  }

  toggleLeftSidenav() {
    this.sidebarService.toggle();
  }

  showSettings() {
    this.settingsService.open();
  }

  addRepository() {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    // dialogConfig.width = '100px'
    // dialogConfig.height = '50px'
    this.dialog.open(AddRepositoryComponent, dialogConfig)
  }

  sync() {

  }
}
