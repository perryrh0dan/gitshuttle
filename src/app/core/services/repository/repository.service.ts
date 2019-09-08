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
    JSON.parse(repositoryString).forEach(element => {
      let repo = new Repository();
      repo.name = element.name;
      repo.path = element.path;
      repo.type = element.type;
      repoList.push(repo)
    });
    this.repositoriesSubject.next(repoList);
  }

  save(repository) {
    localStorage.setItem('repos', JSON.stringify(repository));
  }

  addRepository(path) {
    this.gitService.listRemotes(path).then(repositoryRemotes => {
      let newRepository = new Repository();
      newRepository.name = path;
      newRepository.path = path;
      newRepository.type = RepoType.OTHER;
      let newRepositories = this.repositoriesSubject.value;
      newRepositories.push(newRepository);
      this.save(newRepositories);
    })
  }
}