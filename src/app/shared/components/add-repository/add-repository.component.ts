import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GitService, RepositoryService } from '../../../core/services';
const dialog = require('electron').remote.dialog;
const browserWindow = require('electron').remote.BrowserWindow

@Component({
  selector: 'app-add-repository',
  templateUrl: './add-repository.component.html',
  styleUrls: ['./add-repository.component.scss']
})
export class AddRepositoryComponent implements OnInit {
  repositoryPath;

  constructor(
    private gitService: GitService,
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
    this.repositoryService.addRepository(this.repositoryPath);
  }
}
