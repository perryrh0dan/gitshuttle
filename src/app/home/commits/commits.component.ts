import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GitService, RepositoryService } from '../../core/services';
import { Repository } from '../../core/models';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  styleUrls: ['./commits.component.scss']
})
export class CommitsComponent implements OnInit {
  @Output() commitSelected:EventEmitter<{}> = new EventEmitter<{}>();
  
  currentRepository: Repository;
  histroyList = [];
  selectedCommit;

  constructor(
    private repositoryService: RepositoryService,
    private gitService: GitService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      this.loadCommits();
    })
  }

  loadCommits() {
    this.gitService.getCommitHistory(this.currentRepository).then(histroyList => {
      this.histroyList = histroyList;
    })
  }

  selectCommit(commit) {
    this.selectedCommit = commit;
    this.commitSelected.emit(commit);
  }
}
