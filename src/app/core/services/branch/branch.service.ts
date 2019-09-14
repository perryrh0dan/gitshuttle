import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from '../../models';
import { GitService } from '../git/git.service';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class BranchService {
  private currentBranchSubject: BehaviorSubject<String>;
  public currentBranch: Observable<String>;
  private remoteBranchesSubject: BehaviorSubject<Array<String>>;
  public remotebranches: Observable<Array<String>>;
  private localBranchesSubject: BehaviorSubject<Array<String>>;
  public localBranches: Observable<Array<String>>;

  constructor(
    private gitService: GitService,
    private repositoryService: RepositoryService
  ) {
    this.currentBranchSubject = new BehaviorSubject<String>('');
    this.currentBranch = this.currentBranchSubject.asObservable();
    this.remoteBranchesSubject = new BehaviorSubject<Array<String>>([]);
    this.remotebranches = this.remoteBranchesSubject.asObservable();
    this.localBranchesSubject = new BehaviorSubject<Array<String>>([]);
    this.localBranches = this.localBranchesSubject.asObservable();
    this.repositoryService.currentRepository.subscribe(repository => {
      if (repository) {
        this.loadBranches(repository);
      }
    });
  }

  loadBranches(repository: Repository) {
    this.gitService.getCurrentBranch(repository.path).then(result => {
      this.currentBranchSubject.next(result.currentBranch);
      this.remoteBranchesSubject.next(result.remoteBranches);
      this.localBranchesSubject.next(result.localBranches);
    }).catch(error => {
      console.log(error);
    });
  }
}
