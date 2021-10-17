import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  // Recebendo dados do pai
  @Input() headers!: any;
  @Input() set content(value: any) {
    this.dataSource.data = value;
  }
  // Passando um evento para o pai
  @Output() removeEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() restoreEvent = new EventEmitter<number>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  objectKeys = Object.keys;

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  edit(id: number): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.editEvent.emit(id);
  }

  remove(id: number): void {
    this.removeEvent.emit(id);
  }

  restore(id: number): void {
    this.restoreEvent.emit(id);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
