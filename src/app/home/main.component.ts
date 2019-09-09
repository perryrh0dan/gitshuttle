import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { RepositoryService, GitService, ElectronService } from '../core/services';
import { Repository } from '../core/models';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

// libs
const cp = require('../core/libs/code-processor.js');


@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: TabsetComponent;

  faCaretRight = faCaretRight;

  currentRepository: Repository;
  historyList: [];
  selectedCommit;
  selectedTab: TabDirective;
  createCommitStatus: String;
  commitChanges = new Array<any>();
  commitHistory = new Array<any>();

  constructor(
    private electronService: ElectronService,
    private zone: NgZone,
    private repositoryService: RepositoryService,
    private gitService: GitService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      if (value) {
        this.refreshRepositoryChanges(value);
        this.loadCommits(value);
      }
    });

    /* Update the changed files ever time the application is focused */
    this.electronService.remote.getCurrentWindow().on('focus', function () {
      if (this.currentRepository) {
        this.zone.run(() => {
          // set the correct directoryPath. 
          this.refreshRepositoryChanges(this.currentRepository);
          this.loadCommits(this.currentRepository);
        });
      }
    }.bind(this));
  }

  loadCommits(repository) {
    this.gitService.getCommitHistory(repository.path).then(historyList => {
      this.historyList = historyList;
    })
  }

  selectCommit(commit) {
    this.selectedCommit = commit;
    if (commit.manual) {
      this.tabs.tabs[0].active = true;
    }
  }

  commitSelectedChanges(commitMessage) {
    if (commitMessage) {
      let selectedFiles = [];

      this.commitChanges.forEach(function (file) {
        if (file.checked) {
          selectedFiles.push(file.path);
        }
      });

      if (selectedFiles.length > 0) {
        this.gitService.add(this.currentRepository.path, selectedFiles).then(() => {
          this.gitService.commit(this.currentRepository.path, commitMessage).then(() => {
            this.refreshRepositoryChanges(this.currentRepository);
            this.loadCommits(this.currentRepository);
          })
        })
      }
    }
  }

  selectTab(tab: TabDirective) {
    this.selectedTab = tab;
    if (tab.heading === 'Changes') {
      this.createCommitStatus = 'open'
    } else {
      this.createCommitStatus = 'close'
    }
  }

  changeTab(index) {
    this.tabs.tabs[index].active = true;
  }

  onSelect(tab: TabDirective): void {
    this.selectedTab = tab;
    if (tab.heading === 'Changes') {
      this.createCommitStatus = 'open'
    } else {
      this.createCommitStatus = 'close'
    }
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
