import { Component, OnInit, ViewChild, NgZone, ViewEncapsulation } from '@angular/core';
import { RepositoryService, GitService, ElectronService, BranchService } from '../core/services';
import { Repository } from '../core/models';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

import { Store, select } from '@ngrx/store';
import { start, stop } from '../actions/loading.actions';

@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: TabsetComponent;

  currentRepository: Repository;
  currentBranch: String;

  historyList: [];
  selectedCommit;
  selectedTab: TabDirective;
  createCommitStatus: String;
  commitChanges = new Array<any>();
  commitHistory = new Array<any>();

  constructor(
    private store: Store<{}>,
    private electronService: ElectronService,
    private zone: NgZone,
    private repositoryService: RepositoryService,
    private branchService: BranchService,
    private gitService: GitService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      if (value) {
        this.refresh();
      }
    });

    this.branchService.currentBranch.subscribe(value => {
      this.currentBranch = value;
    })

    /* Update the changed files ever time the application is focused */
    this.electronService.remote.getCurrentWindow().on('focus', function () {
      if (this.currentRepository) {
        this.zone.run(() => {
          // set the correct directoryPath.
          this.refresh();
        });
      }
    }.bind(this));
  }

  refresh() {
    this.store.dispatch(start());
    let promises = [];
    promises.push(this.refreshRepositoryChanges());
    promises.push(this.loadCommits());
    Promise.all(promises).finally(() => {
      this.store.dispatch(stop());
    })
  }

  selectCommit(commit) {
    this.selectedCommit = commit;
    if (commit.manual) {
      this.tabs.tabs[0].active = true;
    }
    this.showCommitChanges(commit.commit);
  }

  commit(commitMessage) {
    if (commitMessage) {
      this.store.dispatch(start());
      const selectedFiles = this.getSelectedFiles();

      if (selectedFiles.length > 0) {
        this.gitService.addCommit(this.currentRepository.path, selectedFiles, commitMessage).then(() => {
          this.store.dispatch(stop());
          this.refresh();
        }).catch(error => {

        })
      }
    }
  }

  commitAndPush(commitMessage) {
    if (commitMessage) {
      this.store.dispatch(start());
      const selectedFiles = this.getSelectedFiles();

      if (selectedFiles.length > 0) {
        this.gitService.addCommitPush(this.currentRepository.path, selectedFiles, commitMessage, 'origin', this.currentBranch).then(() => {
          this.store.dispatch(stop());
          this.refresh();
        }).catch(error => {
          this.store.dispatch(stop());
        })
      }
    }
  }

  getSelectedFiles() {
    let selectedFiles = [];

    this.commitChanges.forEach(function (file) {
      if (file.checked) {
        selectedFiles.push(file.path);
      }
    });

    return selectedFiles
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

  loadCommits() {
    return this.gitService.getCommitHistory({ path: this.currentRepository.path }).then(historyList => {
      this.historyList = historyList;
    })
  }

  refreshRepositoryChanges() {
    return this.gitService.getStatus(this.currentRepository.path).then(status => {
      var i = 0,
        deorderedFiles = {},
        newChangesList = [];

      for (i; i < status.files.length; i++) {

        if (this.commitChanges[i]) {

          if (status.files[i].path == this.commitChanges[i].path || deorderedFiles[this.commitChanges[i].path]) {

            // if (this.commitChanges[i].code) {
            //   this.showFileDiff(this.commitChanges[i], true);
            // }

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
