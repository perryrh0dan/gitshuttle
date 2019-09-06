import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SettingsService {
  private isOpenSubject: BehaviorSubject<Boolean>;
  public isOpen: Observable<Boolean>;

  constructor() {
    this.isOpenSubject = new BehaviorSubject<Boolean>(false);
    this.isOpen = this.isOpenSubject.asObservable()
  }

  public open() {
    this.isOpenSubject.next(true);
  }

  public close() {
    this.isOpenSubject.next(false);
  }
}