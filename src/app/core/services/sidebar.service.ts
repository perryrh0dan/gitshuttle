import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SidebarService {
	private sidebar: MatSidenav;
	private isOpenSubject: BehaviorSubject<Boolean>;
	public isOpen: Observable<Boolean>;
	
	constructor() {
		this.isOpenSubject = new BehaviorSubject<Boolean>(true);
		this.isOpen = this.isOpenSubject.asObservable()
	}

	public setSidebar(sidebar: MatSidenav) {
		this.sidebar = sidebar;
	}

	public open() {
		return this.sidebar.open();
	}

	public close() {
		return this.sidebar.close();
	}

	public toggle(): void {
		this.sidebar.toggle();
		this.isOpenSubject.next(!this.isOpenSubject.value);
	}
}