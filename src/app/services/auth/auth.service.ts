import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Auth } from 'src/app/models/auth';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = `${environment.api}/user`;

  constructor(private router: Router, private http: HttpClient) { }

  login(user: Auth): Observable<Auth> {
    return this.http.post<Auth>(`${this.endpoint}/login`, user);
  }

  getUser(id: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}/list/${id}`);
  }

  logout(): void {
    localStorage.removeItem('id_token');

    this.router.navigate(['/login']);
  }

  isLoggedIn(): string {
    const token = localStorage.getItem('id_token');
    if (token) {
      return token;
    } else {
      return '';
    }
  }
}
