import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Item } from 'src/app/models/item';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  endpoint = `${environment.api}/item`;

  constructor(private http: HttpClient) { }

  list(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.endpoint}/list`);
  }

  listDeleted(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.endpoint}/list/deleted`);
  }

  insert(payload?: object): Observable<object> {
    if (!payload) { return EMPTY; }
    return this.http.post<object>(`${this.endpoint}/create`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/delete/${id}`);
  }

  update(trait?: Item): Observable<Item> {
    if (!trait) { return EMPTY; }
    return this.http.put<Item>(`${this.endpoint}/update/${trait.id}`, trait);
  }

  restore(id: number): Observable<any> {
    const item: Item = {
      id: undefined,
      name: '',
      price: 0,
      description: '',
      volume: '',
      category_id: 0,
      traits: [],
      characteristics: [],
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    return this.http.put<Item>(`${this.endpoint}/restore/${id}`, item);
  }

  removeTrait(itemId?: number, traitId?: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/${itemId}/trait/${traitId}`);
  }

  removeCharacteristic(itemId?: number, characteristicId?: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/${itemId}/characteristic/${characteristicId}`);
  }
}
