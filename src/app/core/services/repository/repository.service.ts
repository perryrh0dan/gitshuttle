import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class RepositoryService {
	private isOpenSubject: BehaviorSubject<Boolean>;
	public isOpen: Observable<Boolean>;
	
	constructor() {
		this.isOpenSubject = new BehaviorSubject<Boolean>(true);
		this.isOpen = this.isOpenSubject.asObservable()
	}
}