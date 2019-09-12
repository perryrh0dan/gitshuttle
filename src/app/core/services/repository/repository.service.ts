import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository, RepoType } from '../../models';
import { GitService } from '../git/git.service';

@Injectable()
export class RepositoryService {
  private repositoriesSubject: BehaviorSubject<Array<Repository>>;
  public repositories: Observable<Array<Repository>>;
  private currentRepositorySubject: BehaviorSubject<Repository>;
  public currentRepository: Observable<Repository>;

  constructor(
    private gitService: GitService
  ) {
    this.repositoriesSubject = new BehaviorSubject<Array<Repository>>([]);
    this.repositories = this.repositoriesSubject.asObservable();
    this.currentRepositorySubject = new BehaviorSubject<Repository>(null);
    this.currentRepository = this.currentRepositorySubject.asObservable();
  }

  load() {
    const repoList = Array<Repository>();
    const repositoryString = localStorage.getItem('repos')
    const repoArray = JSON.parse(repositoryString)
    if (repoArray) {
      repoArray.forEach(element => {
        let repo = new Repository();
        repo.name = element.name;
        repo.path = element.path;
        repo.type = element.type;
        repoList.push(repo)
      });
    }
    this.repositoriesSubject.next(repoList);
  }

  save(repository) {
    localStorage.setItem('repos', JSON.stringify(repository));
  }

  selectRepository(repository) {
    this.currentRepositorySubject.next(repository);
  }

  reload() {
    this.currentRepositorySubject.next(this.currentRepositorySubject.value);
  }

  addRepository(path) {
    return this.gitService.listRemotes(path).then(repositoryRemotes => {
      let gitUrlParse = require('git-url-parse');
      let gitUrl = gitUrlParse(repositoryRemotes.origin.push)
      let repositoryExists;
      let newRepository = new Repository();
      newRepository.name = gitUrl.name;
      newRepository.path = path;

      switch (gitUrl.resource) {
        case 'github.com':
          repositoryExists = this.findWhere(this.repositoriesSubject.value, { path: path });
          newRepository.type = RepoType.GITHUB;
          break;
        case 'gitlab.com':
          repositoryExists = this.findWhere(this.repositoriesSubject.value, { path: path });
          newRepository.type = RepoType.GITLAB;
          break;
        default:
          repositoryExists = this.findWhere(this.repositoriesSubject.value, { path: path });
          newRepository.type = RepoType.OTHER;
          break;
      }

      if (!repositoryExists) {
        let newRepositories = this.repositoriesSubject.value;
        newRepositories.push(newRepository);
        this.save(newRepositories);
        this.currentRepositorySubject.next(newRepository);
      } else {
        this.currentRepositorySubject.next(repositoryExists);
      }
    })
  }

  findWhere(array, object) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][Object.keys(object)[0]] == object[Object.keys(object)[0]]) {
        return array[i];
      }
    }

    return null;
  }
}
