import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { GitService, RepositoryService } from '../../core/services';
import { Repository } from '../../core/models';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  styleUrls: ['./commits.component.scss']
})
export class CommitsComponent implements OnChanges {
  @Input() historyList: Array<{}>;
  @Output() commitSelected: EventEmitter<{}> = new EventEmitter<{}>();

  currentRepository: Repository;
  selectedCommit;

  constructor() { }

  ngOnChanges() {
    if (this.historyList && this.historyList.length > 0) {
      this.selectCommit(this.historyList[0], false);
    }
  }

  selectCommit(commit, manual) {
    this.selectedCommit = commit;
    this.commitSelected.emit({ commit, manual });
  }
}
