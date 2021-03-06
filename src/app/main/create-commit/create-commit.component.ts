import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { BranchService } from '../../core/services';
const wos = require('node-wos');

@Component({
  selector: 'app-create-commit',
  templateUrl: './create-commit.component.html',
  styleUrls: ['./create-commit.component.scss'],
  animations: [
    trigger('creation', [
      transition(':enter', [
        style({ height: '0px' }),
        animate(150, style({ height: '100px' }))
      ]),
      transition(':leave', [
        animate(150, style({ height: '0px' }))
      ])
    ])
  ]
})
export class CreateCommitComponent implements OnInit {
  @Input() status: String;
  @Output() onCommit: EventEmitter<String> = new EventEmitter<String>();
  @Output() onCommitAndPush: EventEmitter<String> = new EventEmitter<String>();

  commitMessage: String;
  commitDescription: String;

  constructor(
  ) { }

  ngOnInit() {
  }

  commit() {
    const message = this.parseMessage();
    this.onCommit.emit(message);
    this.clear();
  }

  commitAndPush() {
    const message = this.parseMessage();
    this.onCommitAndPush.emit(message);
    this.clear();
  }

  parseMessage() {
    let message = ''.concat((this.commitMessage.replace(/"/g, '\\"')));
    if (this.commitDescription) {
      if (wos.isWindows()) {
        message = message + this.commitDescription.replace(/"/g, '\\"').replace(/\n/g, '" -m "');
      } else {
        message = message.concat(this.commitDescription.replace(/"/g, '\\"'));
      }
    }
    return message;
  }

  clear() {
    this.commitMessage = '';
    this.commitDescription = '';
  }
}
