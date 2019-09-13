import { Component, OnInit } from '@angular/core';
import { CommitsService } from '../services';
import { Store } from '@ngrx/store';
import { open } from '../../actions/maintab.actions';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  styleUrls: ['./commits.component.scss']
})
export class CommitsComponent implements OnInit {
  historyList;
  selectedCommit;

  constructor(
    private store: Store<{}>,
    private commitsService: CommitsService
  ) { }

  ngOnInit() {
    this.commitsService.commits.subscribe(commits => {
      this.historyList = commits;
    })
    this.commitsService.selectedCommit.subscribe(commit => {
      this.selectedCommit = commit;
    })
  }

  selectCommit(commit) {
    this.store.dispatch(open('left'));
    this.commitsService.selectCommit(commit);
  }
}
