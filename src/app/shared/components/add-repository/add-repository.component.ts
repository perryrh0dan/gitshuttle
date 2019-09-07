import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
const dialog = require('electron').remote.dialog;
const browserWindow = require('electron').remote.BrowserWindow

@Component({
  selector: 'app-add-repository',
  templateUrl: './add-repository.component.html',
  styleUrls: ['./add-repository.component.scss']
})
export class AddRepositoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showOpenDialog(bindVarName) {
    let currentWindow = browserWindow.getFocusedWindow();

    dialog.showOpenDialog(currentWindow, { properties: ['openDirectory'] }, function (filenames) {

      if (filenames) {
        this[bindVarName] = filenames[0];
      }
    }.bind(this));
  }
}
