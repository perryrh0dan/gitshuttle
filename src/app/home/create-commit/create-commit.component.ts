import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-commit',
  templateUrl: './create-commit.component.html',
  styleUrls: ['./create-commit.component.scss'],
  animations: [
    trigger('creation', [
      transition(":enter", [
        style({ height: '0px' }),
        animate(150, style({ height: '100px' }))
      ]),
      transition(":leave", [
        animate(150, style({ height: '0px' }))
      ])
    ])
  ]
})
export class CreateCommitComponent implements OnInit {
  @Input() status: String

  constructor() { }

  ngOnInit() {
  }

}
