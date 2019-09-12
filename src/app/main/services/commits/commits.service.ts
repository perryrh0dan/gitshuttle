import { BehaviorSubject, Observable } from 'rxjs';
import { GitService, RepositoryService } from '../../../core/services';
import { Repository } from '../../../core/models';

export class CommitsService {
  private commitsSubject: BehaviorSubject<Array<any>>;
  public commits: Observable<Array<any>>;
  private selectedCommitSubject: BehaviorSubject<any>;
  public selectedCommit: Observable<any>;
  private currentChangesSubject: BehaviorSubject<Array<any>>;
  public currentChanges: Observable<Array<any>>;
  private commitChangesSubject: BehaviorSubject<Array<any>>;
  public commitChanges: Observable<Array<any>>;

  currentRepository: Repository;

  constructor(
    private gitService: GitService,
    private repositoryService: RepositoryService
  ) {
    this.commitsSubject = new BehaviorSubject<Array<any>>([]);
    this.commits = this.commitsSubject.asObservable();
    this.selectedCommitSubject = new BehaviorSubject<any>(null);
    this.selectedCommit = this.selectedCommitSubject.asObservable();
    this.currentChangesSubject = new BehaviorSubject<Array<any>>([]);
    this.currentChanges = this.currentChangesSubject.asObservable();
    this.commitChangesSubject = new BehaviorSubject<Array<any>>([]);
    this.commitChanges = this.commitChangesSubject.asObservable();
    this.repositoryService.currentRepository.subscribe(repository => {
      this.currentRepository = repository;
    });
  }

  public loadCommits() {
    if (this.currentRepository) {
      return this.gitService
        .getCommitHistory({ path: this.currentRepository.path })
        .then(commits => {
          this.commitsSubject.next(commits);
          if (commits.length > 0) {
            this.selectedCommitSubject.next(commits[0]);
          }
        });
    }
  }

  public loadCurrentChanges() {
    if (this.currentRepository) {
      return this.gitService
        .getStatus(this.currentRepository.path)
        .then(status => {
          let i = 0;
          let deorderedFiles = {};
          let newChangesList = [];
          let commitChanges = this.currentChangesSubject.value;

          for (i; i < status.files.length; i++) {
            if (commitChanges[i]) {
              if (
                status.files[i].path == commitChanges[i].path ||
                deorderedFiles[commitChanges[i].path]
              ) {
                // if (this.commitChanges[i].code) {
                //   this.showFileDiff(this.commitChanges[i], true);
                // }

                commitChanges[i].staged = status.files[i].staged;
                commitChanges[i].type = status.files[i].type;

                newChangesList.push(commitChanges[i]);
              } else {
                deorderedFiles[commitChanges[i]] = commitChanges[i];
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

          this.currentChangesSubject.next(newChangesList);
        });
    }
  }

  loadCommitChanges() {
    const commit = this.selectedCommitSubject.value;

    var opts = {
      hash: commit.hash,
      ancestorHash: commit.parentHash,
      path: this.currentRepository.path
    };

    this.gitService.getDiff(opts).then(files => {
      let commitHistory = [];

      files.forEach(file => {
        if (file.name) {
          if (!file.isBinary) {
            var changesHTML = [];

            if (file.additions > 0) {
              changesHTML.push(
                '<span class="plus-text"><span class="octicon octicon-diff-added"></span>',
                file.additions,
                '</span>'
              );
            }

            if (file.deletions > 0) {
              changesHTML.push(
                '<span class="minor-text"><span class="octicon octicon-diff-removed"></span>',
                file.deletions,
                '</span>'
              );
            }

            file.changes = changesHTML.join('');
          } else {
            file.changes = `
            <span class="label-binary no-background">
              <span class="octicon octicon-file-binary"></span> BINARY
            </span>`;
          }

          commitHistory.push(file);
        }
      });
      this.commitChangesSubject.next(commitHistory);
    });
  }

  public async refresh() {
    let promises = [];
    promises.push(this.loadCurrentChanges());
    promises.push(this.loadCommits());
    Promise.all(promises).finally(() => {
      Promise.resolve();
    });
  }

  public selectCommit(commit) {
    this.selectedCommitSubject.next(commit);
    this.loadCommitChanges();
  }
}
