import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.scss']
})
export class CommitComponent implements OnInit, OnChanges {
  @Input() type: String;
  @Input() changes: Array<{}>;
  @Input() selectedCommit: any;

  faCaretRight = faCaretRight;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.selectedCommit)
  }
}
