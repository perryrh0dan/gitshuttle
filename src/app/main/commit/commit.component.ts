import { Component, Input, OnInit } from '@angular/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { GitService, RepositoryService } from '../../core/services';
import { Repository } from '../../core/models';
import { CommitsService } from '../services';

// Store
import { Store } from '@ngrx/store';
import { start, stop } from '../../actions/loading.actions';

// libs
const cp = require('../../core/libs/code-processor.js');

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss']
})
export class CommitComponent implements OnInit {
  @Input() type: String;
  @Input() changes: Array<any>;

  selectedCommit: any;

  faCaretRight = faCaretRight;

  currentRepository: Repository;

  constructor(
    private store: Store<{}>,
    private repositoryService: RepositoryService,
    private gitService: GitService,
    private commitsService: CommitsService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
    });
    this.commitsService.selectedCommit.subscribe(value => {
      this.selectedCommit = value;
    });
  }

  collapseAll() {
    this.changes.forEach(change => {
      change.showCode = false;
    });
  }

  expandAll() {
    this.changes.forEach(change => {
      this.showFileDiff(change, false);
    });
  }

  getChangeTypeClass(type) {
    switch (type) {
      case 'MODIFIED':
        return 'label-modified';

      case 'DELETED':
        return 'label-deleted';

      case 'NEW':
        return 'label-new';

      case 'RENAMED':
        return 'label-renamed';

      case 'ADDED':
        return 'label-added';

      case 'UNMERGED':
        return 'label-unmerged';
    }
  }

  getChangeTypeMessage(type) {
    return 'COMMIT.CHANGETYPE.' + type;
  }

  discartAllSelected() {
    let files = [];

    this.changes.forEach(change => {
      if (change.checked && !change.staged) {
        files.push({
          path: change.path,
          isUnknown: change.type == 'New'
        });
      }
    });

    if (files.length > 0) {
      this.store.dispatch(start());
      this.gitService
        .discartChangesInFile(this.currentRepository.path, { files: files })
        .then(() => {
          this.commitsService.refresh().then(() => {
            this.store.dispatch(stop());
          });
        })
        .catch(error => {
          this.store.dispatch(stop());
        });
    }
  }

  showFileDiff(change, forceReload) {
    if (!change.code || forceReload) {
      if (!change.isUnsyc) {
        this.gitService
          .getFileDiff({
            file: change.name,
            hash: this.selectedCommit.hash,
            path: this.currentRepository.path
          })
          .then(stdout => {
            change.code = cp.processCode(stdout, change.path);

            if (change.showCode) {
              change.showCode = false;
            } else {
              change.showCode = true;
            }
          });
      } else if (change.type != 'DELETED') {
        this.gitService
          .getUnsyncFileDiff({
            path: this.currentRepository.path,
            file: change.path
          })
          .then(diff => {
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
}
