import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GitService, RepositoryService } from '../../../core/services';
const dialog = require('electron').remote.dialog;
const browserWindow = require('electron').remote.BrowserWindow;

import { Store, select } from '@ngrx/store';
import { start, stop } from '../../../actions/loading.actions';

@Component({
  selector: 'app-add-repository',
  templateUrl: './add-repository.component.html',
  styleUrls: ['./add-repository.component.scss']
})
export class AddRepositoryComponent implements OnInit {
  repositoryPath;

  constructor(
    private store: Store<{}>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRepositoryComponent>,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
  }

  showOpenDialog(bindVarName) {
    let self = this;
    let currentWindow = browserWindow.getFocusedWindow();

    dialog.showOpenDialog(currentWindow, { properties: ['openDirectory'] }).then((result) => {
      // if (result.canceled) {
      //   return;
      // }
      if (result.filePaths) {
        self[bindVarName] = result.filePaths[0];
      }
    });
  }

  addRepository() {
    this.store.dispatch(start())
    this.repositoryService.addRepository(this.repositoryPath).then(() => {
      this.dialogRef.close()
      this.store.dispatch(stop());
    });
  }
}
