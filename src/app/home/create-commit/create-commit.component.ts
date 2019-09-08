import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-commit',
  templateUrl: './create-commit.component.html',
  styleUrls: ['./create-commit.component.scss'],
  animations: [
    trigger('creation', [
      transition(":enter", [
        style({ height: '80px' }),
        animate(150, style({ height: '300px' }))
      ]),
      transition(":leave", [
        animate(150, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CreateCommitComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
