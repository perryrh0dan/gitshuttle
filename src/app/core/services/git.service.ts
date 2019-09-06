import { BehaviorSubject } from "rxjs";

var git = require('../git');

export class GitService {
  private currentBranchSubject;
  public currentBranch;
  private remoteBranches;
  private localBranches;

  constructor() {
    this.currentBranchSubject = new BehaviorSubject<String>('');
		this.currentBranch = this.currentBranchSubject.asObservable()
  }

  public getCurrentBranch() {
    const self = this;

    git.getCurrentBranch('C:\\Dev\\taskline', function (err, currentBranch, remoteBranches, localBranches) {
      self.currentBranchSubject.next(currentBranch);
      self.remoteBranches = remoteBranches;
      self.localBranches = localBranches;
    });
  }
}