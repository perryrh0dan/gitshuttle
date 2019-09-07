import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository } from '../../models';

@Injectable()
export class RepositoryService {
	private repositoriesSubject: BehaviorSubject<Array<Repository>>;
  public repositories: Observable<Array<Repository>>;
  private currentRepositorySubject: BehaviorSubject<Repository>;
  public currentRepository: Observable<Repository>;
	
	constructor() {
		this.repositoriesSubject = new BehaviorSubject<Array<Repository>>([]);
    this.repositories = this.repositoriesSubject.asObservable();
    this.currentRepositorySubject = new BehaviorSubject<Repository>(null);
    this.currentRepository = this.currentRepositorySubject.asObservable();
  }

  load() {
    const repositoryString = localStorage.getItem('repos')
    JSON.parse(repositoryString);
  }
  
  save(repository) {
    localStorage.setItem('repos', JSON.stringify(repository));
  }
}