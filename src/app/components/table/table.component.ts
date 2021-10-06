import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() headers!: any;
  @Input() content!: any;
  objectKeys = Object.keys;

  constructor() {}

  ngOnInit(): void {}

  edit(id: number): void {
    console.log(id);
  }

  delete(id: number): void {
    console.log(id);
  }
}
