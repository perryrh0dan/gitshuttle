import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Repository, RepoType } from '../../models';
import { GitService } from '../git/git.service';

@Injectable()
export class AppService {
  private isLoadingSubject: BehaviorSubject<Boolean>;
  public isLoading: Observable<Boolean>;

  constructor() {
    this.isLoadingSubject = new BehaviorSubject<Boolean>(false);
    this.isLoading = this.isLoadingSubject.asObservable();
  }

  setLoading(value: Boolean) {
    this.isLoadingSubject.next(value);
  }
}