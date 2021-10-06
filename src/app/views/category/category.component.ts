import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryHeaders = {id: 'ID', name: 'Nome', created_at: 'Criado em', updated_at: 'Atualizado em', deleted_at: 'Apagado em'};
  categoryContent: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.categoryService.list().subscribe(categories => {
      this.categoryContent = categories;
    });
  }

}
