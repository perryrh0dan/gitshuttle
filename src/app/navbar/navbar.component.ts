import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
  faPlus,
  faCog,
  faToggleOn,
  faToggleOff,
  faSync,
  faCodeBranch,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

import { AddRepositoryComponent } from '../shared/components';
import { BranchService } from '../core/services/branch/branch.service';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { open } from '../actions/settings.actions';
import { toggle } from '../actions/sidebar.actions';
import { RepositoryService } from '../core/services';

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

  isLoading$: Observable<Boolean>;
  sidebarIsOpen$: Observable<Boolean>;
  currentBranch: String;

  constructor(
    private repositoryService: RepositoryService,
    private branchService: BranchService,
    private dialog: MatDialog,
    private store: Store<{ loading: Boolean }>
  ) {
    this.isLoading$ = this.store.pipe(select('loading'));
    this.sidebarIsOpen$ = this.store.pipe(select('sidebar'));
  }

  ngOnInit() {
    this.branchService.currentBranch.subscribe(value => {
      this.currentBranch = value;
    });
  }

  toggleSidebar() {
    this.store.dispatch(toggle());
  }

  showSettings() {
    this.store.dispatch(open());
  }

  addRepository() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '100px'
    // dialogConfig.height = '50px'
    this.dialog.open(AddRepositoryComponent, dialogConfig);
  }
}
