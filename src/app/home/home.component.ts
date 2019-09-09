import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { RepositoryService } from '../core/services';
import { Repository } from '../core/models';
import { TabDirective } from 'ngx-bootstrap';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRepository: Repository;
  selectedCommit;
  selectedTab: TabDirective;
  createCommitStatus: String;

  constructor(
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
    });
  }

  selectCommit(commit) {
    this.selectedCommit = commit;
  }

  selectTab(tab: TabDirective) {
    this.selectedTab = tab;
    if (tab.heading === 'Changes') {
      this.createCommitStatus = 'open'
    } else {
      this.createCommitStatus = 'close'
    }
  }
}
