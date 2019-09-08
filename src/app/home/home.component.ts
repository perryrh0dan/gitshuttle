import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/services';
import { Repository } from '../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentRepository: Repository;
  selectedCommit;

  constructor(
    private repositoryService: RepositoryService
  ) { }

  ngOnInit() {
    this.repositoryService.currentRepository.subscribe(value => {
      this.currentRepository = value;
    })
  }
}
