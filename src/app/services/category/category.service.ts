import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  endpoint = `${environment.api}/category`;

  constructor(private http: HttpClient) { }

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.endpoint}/list`);
  }

  insert(payload?: object): Observable<object> {
    if (!payload) { return EMPTY; }
    return this.http.post<object>(`${this.endpoint}/create`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/delete/${id}`);
  }

  update(category?: Category): Observable<Category> {
    if (!category) { return EMPTY; }
    return this.http.put<Category>(`${this.endpoint}/update/${category.id}`, category);
  }

  restore(id: number): Observable<any> {
    const category: Category = {
      id: undefined,
      name: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    return this.http.put<Category>(`${this.endpoint}/restore/${id}`, category);
  }
}
