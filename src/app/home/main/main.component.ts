import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { GitService, RepositoryService } from '../../core/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  @Input() selectedCommit: {};
  currentRepository;
  commitChanges = new Array<{}>();

  constructor(
    private gitService: GitService,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
      this.refreshRepositoryChanges(value);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  refreshRepositoryChanges(repository) {
    this.gitService.getStatus(repository.path).then(status => {
      var i = 0,
        deorderedFiles = {},
        newChangesList = [];

      for (i; i < status.files.length; i++) {

        if (this.commitChanges[i]) {

          if (status.files[i].path == this.commitChanges[i].path || deorderedFiles[this.commitChanges[i].path]) {

            // if (this.commitChanges[i].code) {
            //   this.showFileDiff(this.commitChanges[i], true);
            // }

            this.commitChanges[i].staged = status.files[i].staged;
            this.commitChanges[i].type = status.files[i].type;

            newChangesList.push(this.commitChanges[i]);

          } else {
            deorderedFiles[this.commitChanges[i]] = this.commitChanges[i];
            status.files[i].checked = true;
            status.files[i].isUnsyc = true;
            newChangesList.push(status.files[i]);
          }

        } else {
          status.files[i].checked = true;
          status.files[i].isUnsyc = true;
          newChangesList.push(status.files[i]);
        }
      }

      this.commitChanges = newChangesList;
    })
  }
}
