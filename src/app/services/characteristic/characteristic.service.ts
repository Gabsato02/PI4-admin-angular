import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Characteristic } from 'src/app/models/characteristic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharacteristicService {
  endpoint = `${environment.api}/characteristic`;

  constructor(private http: HttpClient) { }

  list(): Observable<Characteristic[]> {
    return this.http.get<Characteristic[]>(`${this.endpoint}/list`);
  }

  listDeleted(): Observable<Characteristic[]> {
    return this.http.get<Characteristic[]>(`${this.endpoint}/list/deleted`);
  }

  insert(payload?: object): Observable<object> {
    if (!payload) { return EMPTY; }
    return this.http.post<object>(`${this.endpoint}/create`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/delete/${id}`);
  }

  update(characteristic?: Characteristic): Observable<Characteristic> {
    if (!characteristic) { return EMPTY; }
    return this.http.put<Characteristic>(`${this.endpoint}/update/${characteristic.id}`, characteristic);
  }

  restore(id: number): Observable<any> {
    const characteristic: Characteristic = {
      id: undefined,
      name: '',
      description: '',
      characteristics_value: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    return this.http.put<Characteristic>(`${this.endpoint}/restore/${id}`, characteristic);
  }
}
