import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ViewEncapsulation,
  OnChanges
} from '@angular/core';
import {
  RepositoryService,
  GitService,
  ElectronService,
  BranchService
} from '../core/services';
import { Repository } from '../core/models';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';

// Store
import { Store, select } from '@ngrx/store';
import { start, stop } from '../actions/loading.actions';
import { open } from '../actions/maintab.actions';

import { CommitsService } from './services';
import { Observable } from 'rxjs';
import { selectMainTab } from '../selector/maintab.selector';

@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnChanges {
  @ViewChild('tabs', { static: true }) public tabs: TabsetComponent;

  currentRepository: Repository;
  currentBranch: String;

  selectedCommit;
  selectedTab: Observable<string>;
  createCommitStatus: String;
  commitChanges = new Array<any>();
  commitHistory = new Array<any>();

  constructor(
    private store: Store<{}>,
    private electronService: ElectronService,
    private zone: NgZone,
    private repositoryService: RepositoryService,
    private branchService: BranchService,
    private commitsService: CommitsService,
    private gitService: GitService
  ) { 
    this.store.select<String>(selectMainTab).subscribe(value => {  
      this.changeTab(0);
    })
  }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      if (value) {
        this.refresh();
      }
    });

    this.branchService.currentBranch.subscribe(value => {
      this.currentBranch = value;
    });

    this.commitsService.currentChanges.subscribe(value => {
      this.commitChanges = value;
    });

    this.commitsService.selectedCommit.subscribe(value => {
      this.selectedCommit = value;
    });

    this.commitsService.commitChanges.subscribe(value => {
      this.commitHistory = value;
    });

    /* Update the changed files ever time the application is focused */
    this.electronService.remote.getCurrentWindow().on(
      'focus',
      function () {
        if (this.currentRepository) {
          this.zone.run(() => {
            // set the correct directoryPath.
            this.refresh();
          });
        }
      }.bind(this)
    );
  }

  ngOnChanges() {
    console.log(this.selectedTab);
  }

  refresh() {
    this.store.dispatch(start());
    this.commitsService.refresh().then(() => {
      this.store.dispatch(stop());
    });
  }

  commit(commitMessage) {
    if (commitMessage) {
      this.store.dispatch(start());
      const selectedFiles = this.getSelectedFiles();

      if (selectedFiles.length > 0) {
        this.gitService
          .addCommit(this.currentRepository.path, selectedFiles, commitMessage)
          .then(() => {
            this.store.dispatch(stop());
            this.refresh();
          })
          .catch(error => { });
      }
    }
  }

  commitAndPush(commitMessage) {
    if (commitMessage) {
      this.store.dispatch(start());
      const selectedFiles = this.getSelectedFiles();

      if (selectedFiles.length > 0) {
        this.gitService
          .addCommitPush(
            this.currentRepository.path,
            selectedFiles,
            commitMessage,
            'origin',
            this.currentBranch
          )
          .then(() => {
            this.store.dispatch(stop());
            this.refresh();
          })
          .catch(error => {
            this.store.dispatch(stop());
          });
      }
    }
  }

  getSelectedFiles() {
    const selectedFiles = [];

    this.commitChanges.forEach(function (file) {
      if (file.checked) {
        selectedFiles.push(file.path);
      }
    });

    return selectedFiles;
  }

  selectTab(tab: TabDirective) {
    if (tab.heading === 'Changes') {
      // this.store.dispatch(open('right'));
      this.createCommitStatus = 'open';
    } else {
      this.createCommitStatus = 'close';
    }
  }

  changeTab(index) {
    if (!this.tabs) return;
    this.tabs.tabs[index].active = true;
  }

  onSelect(tab: TabDirective): void {
    if (tab.heading === 'Changes') {
      this.createCommitStatus = 'open';
    } else {
      this.createCommitStatus = 'close';
    }
  }
}
