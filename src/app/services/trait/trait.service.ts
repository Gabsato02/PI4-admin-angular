import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Trait } from 'src/app/models/trait';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraitService {
  endpoint = `${environment.api}/trait`;

  constructor(private http: HttpClient) { }

  list(): Observable<Trait[]> {
    return this.http.get<Trait[]>(`${this.endpoint}/list`);
  }

  listDeleted(): Observable<Trait[]> {
    return this.http.get<Trait[]>(`${this.endpoint}/list/deleted`);
  }

  insert(payload?: object): Observable<object> {
    if (!payload) { return EMPTY; }
    return this.http.post<object>(`${this.endpoint}/create`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/delete/${id}`);
  }

  update(trait?: Trait): Observable<Trait> {
    if (!trait) { return EMPTY; }
    return this.http.put<Trait>(`${this.endpoint}/update/${trait.id}`, trait);
  }

  restore(id: number): Observable<any> {
    const trait: Trait = {
      id: undefined,
      name: '',
      description: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    return this.http.put<Trait>(`${this.endpoint}/restore/${id}`, trait);
  }
}
