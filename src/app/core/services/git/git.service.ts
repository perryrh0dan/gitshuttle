import { BehaviorSubject, Observable } from "rxjs";
import { Repository } from "../../models";

var git = require('../../libs/git');
const sg = require('simple-git/promise');

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

  public add(path, files) {
    return sg(path).add(files)
  }

  public commit(path, message) {
    return sg(path).commit(message);
  }

  public push(path, branch) {
    return sg(path).push(path, branch);
  }

  public getGlobalConfigs() {
    return git.getGlobalConfigs();
  }

  public getLocalConfigs() {
    return git.getLocalConfigs();
  }
}