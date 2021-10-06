import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryHeaders = {id: 'ID', name: 'Nome', created_at: 'Criado em', updated_at: 'Atualizado em', deleted_at: 'Apagado em'};
  categoryContent = [
    {
      id: 1,
      name: 'Espadas',
      created_at: '2021-09-20 18:49:04',
      updated_at: '2021-09-20 18:49:04',
      deleted_at: null,
      items: null
    },
    {
      id: 2,
      name: 'Categoria 2',
      created_at: '2021-09-23 21:17:30',
      updated_at: '2021-09-23 21:17:30',
      deleted_at: null,
      items: null
    },
    {
      id: 3,
      name: 'Categoria 3',
      created_at: '2021-12-23 21:17:30',
      updated_at: '2021-01-23 21:17:30',
      deleted_at: null,
      items: null
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
