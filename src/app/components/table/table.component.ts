import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  // Recebendo dados do pai
  @Input() headers!: any;
  @Input() content!: any;
  // Passando um evento para o pai
  @Output() removeEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() restoreEvent = new EventEmitter<number>();
  objectKeys = Object.keys;

  constructor() {}

  ngOnInit(): void {}

  edit(id: number): void {
    this.editEvent.emit(id);
  }

  remove(id: number): void {
    this.removeEvent.emit(id);
  }

  restore(id: number): void {
    this.restoreEvent.emit(id);
  }
}
