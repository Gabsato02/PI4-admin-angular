import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = `${environment.api}/user`;

  constructor(private http: HttpClient) { }

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}/list`);
  }

  insert(payload?: object): Observable<object> {
    if (!payload) { return EMPTY; }
    return this.http.post<object>(`${this.endpoint}/create`, payload);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/delete/${id}`);
  }

  update(user?: User): Observable<User> {
    if (!user) { return EMPTY; }
    return this.http.put<User>(`${this.endpoint}/update/${user.id}`, user);
  }

  restore(id: number): Observable<any> {
    const user: User = {
      id: undefined,
      name: '',
      email: '',
      password: '',
      role: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    return this.http.put<User>(`${this.endpoint}/restore/${id}`, user);
  }
}
