import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/services';
import { Repository } from '../core/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  repositories: Array<Repository>;

  constructor(
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
    this.repositoryService.repositories.subscribe(value => {
      this.repositories = value;
    })
    this.repositoryService.load()
  }
}
