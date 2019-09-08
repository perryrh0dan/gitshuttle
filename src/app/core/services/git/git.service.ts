import { BehaviorSubject, Observable } from "rxjs";

var git = require('../../libs/git');

export class GitService {
  private currentBranchSubject: BehaviorSubject<String>;
  public currentBranch: Observable<String>;
  private remoteBranchesSubject: BehaviorSubject<Array<String>>;
  public remotebranches: Observable<Array<String>>;
  private localBranchesSubject: BehaviorSubject<Array<String>>;
  public localBranches: Observable<Array<String>>;

  constructor() {
    this.currentBranchSubject = new BehaviorSubject<String>('');
    this.currentBranch = this.currentBranchSubject.asObservable()
    this.remoteBranchesSubject = new BehaviorSubject<Array<String>>([]);
    this.remotebranches = this.remoteBranchesSubject.asObservable()
    this.localBranchesSubject = new BehaviorSubject<Array<String>>([]);
    this.localBranches = this.localBranchesSubject.asObservable()
  }

  public getCurrentBranch() {
    const self = this;

    git.getCurrentBranch('C:\\Dev\\taskline').then(result => {
      self.currentBranchSubject.next(result.currentBranch);
      self.remoteBranchesSubject.next(result.remoteBranches);
      self.localBranchesSubject.next(result.localBranches);
    }).catch(error => {
      console.log(error)
    });
  }

  public listRemotes(path) {
    return git.listRemotes(path)
  }
}