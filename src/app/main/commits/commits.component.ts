import { Component, OnInit } from '@angular/core';
import { CommitsService } from '../services';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  styleUrls: ['./commits.component.scss']
})
export class CommitsComponent implements OnInit {
  historyList;
  selectedCommit;

  constructor(
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

  selectCommit(commit, manual) {
    this.commitsService.selectCommit(commit);
  }
}
