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

  ngOnInit(): void {
    console.log(this.headers);
    console.log(this.content);
  }

}