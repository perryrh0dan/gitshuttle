import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild, Output, EventEmitter } from '@angular/core';
import { GitService, RepositoryService } from '../../core/services';

import { TabsetComponent, TabDirective } from 'ngx-bootstrap'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

var cp = require('../../core/libs/code-processor.js');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  @Input() selectedCommit: any;
  @Output() selectedTab: EventEmitter<TabDirective> = new EventEmitter<TabDirective>();
  @ViewChild('tabs', { static: true }) public tabs: TabsetComponent;

  faCaretRight = faCaretRight;

  currentRepository;
  commitChanges = new Array<any>();
  commitHistory = new Array<any>();

  constructor(
    private gitService: GitService,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      this.refreshRepositoryChanges(value);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.tabs.tabs[0].active = true;
    // if (changes.selectedCommit && changes.selectedCommit.currentValue) {
    //   this.showCommitChanges(changes.selectedCommit.currentValue)
    // }
  }

  changeTab(index) {
    this.tabs.tabs[index].active = true;
  }

  onSelect(data: TabDirective): void {
    this.selectedTab.emit(data);
  }

  refreshRepositoryChanges(repository) {
    this.gitService.getStatus(repository.path).then(status => {
      var i = 0,
        deorderedFiles = {},
        newChangesList = [];

      for (i; i < status.files.length; i++) {

        if (this.commitChanges[i]) {

          if (status.files[i].path == this.commitChanges[i].path || deorderedFiles[this.commitChanges[i].path]) {

            if (this.commitChanges[i].code) {
              this.showFileDiff(this.commitChanges[i], true);
            }

            this.commitChanges[i].staged = status.files[i].staged;
            this.commitChanges[i].type = status.files[i].type;

            newChangesList.push(this.commitChanges[i]);

          } else {
            deorderedFiles[this.commitChanges[i]] = this.commitChanges[i];
            status.files[i].checked = true;
            status.files[i].isUnsyc = true;
            newChangesList.push(status.files[i]);
          }

        } else {
          status.files[i].checked = true;
          status.files[i].isUnsyc = true;
          newChangesList.push(status.files[i]);
        }
      }

      this.commitChanges = newChangesList;
    })
  }

  showFileDiff(change, forceReload) {
    if (!change.code || forceReload) {

      if (!change.isUnsyc) {
        this.gitService.getFileDiff({
          file: change.name,
          hash: this.selectedCommit.hash,
          path: this.currentRepository.path

        }).then(stdout => {

          change.code = cp.processCode(stdout, change.path);

          if (change.showCode) {
            change.showCode = false;
          } else {
            change.showCode = true;
          }
        });
      } else if (change.type != 'DELETED') {

        this.gitService.getUnsyncFileDiff({
          path: this.currentRepository.path,
          file: change.path
        }).then(diff => {

          change.code = cp.processCode(diff, change.path);

          if (!forceReload) {
            change.showCode = !change.showCode;
          }
        });
      }

    } else {
      change.showCode = !change.showCode;
    }
  }

  showCommitChanges(commit) {
    var opts = {
      hash: commit.hash,
      ancestorHash: commit.parentHash,
      path: this.currentRepository.path
    };

    this.gitService.getDiff(opts).then(files => {
      this.commitHistory = [];

      files.forEach(function (file) {

        if (file.name) {

          if (!file.isBinary) {
            var changesHTML = [];

            if (file.additions > 0) {
              changesHTML.push('<span class="plus-text"><span class="octicon octicon-diff-added"></span>', file.additions, '</span>');
            }


            if (file.deletions > 0) {
              changesHTML.push('<span class="minor-text"><span class="octicon octicon-diff-removed"></span>', file.deletions, '</span>');
            }

            file.changes = changesHTML.join('');
          } else {
            file.changes = `
            <span class="label-binary no-background">
              <span class="octicon octicon-file-binary"></span> BINARY
            </span>`;
          }

          this.commitHistory.push(file);
        }
      }.bind(this));
    });
  };
}
