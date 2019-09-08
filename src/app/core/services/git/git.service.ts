import { BehaviorSubject, Observable } from "rxjs";
import { Repository } from "../../models";

var git = require('../../libs/git');

export class GitService {
  constructor(
  ) { }

  public getCurrentBranch(path) {
    return git.getCurrentBranch(path);
  }

  public listRemotes(path) {
    return git.listRemotes(path);
  }

  public getCommitHistory(opts) {
    return git.getCommitHistory(opts);
  }

  public getStatus(path) {
    return git.getStatus(path);
  }

  public getDiff(opts) {
    return git.getDiff(opts);
  }

  public getFileDiff(opts) {
    return git.getFileDiff(opts);
  }

  public getUnsyncFileDiff(opts) {
    return git.getUnsyncFileDiff(opts)
  }
}