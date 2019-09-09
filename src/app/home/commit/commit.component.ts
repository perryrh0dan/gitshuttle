import { Component, Input, OnInit } from '@angular/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { GitService, RepositoryService } from '../../core/services';
import { Repository } from '../../core/models';

// libs
const cp = require('../../core/libs/code-processor.js');

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss']
})
export class CommitComponent implements OnInit {
  @Input() type: String;
  @Input() changes: Array<{}>;
  @Input() selectedCommit: any;

  faCaretRight = faCaretRight;

  currentRepository: Repository;

  constructor(
    private repositoryService: RepositoryService,
    private gitService: GitService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
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
}
