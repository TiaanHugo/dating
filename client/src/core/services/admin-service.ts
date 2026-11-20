import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminUpdateUser, AdminUser } from '../../types/member';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'admin/';
  private password = '';

  authenticate(password: string) {
    return this.http.get<AdminUser[]>(this.baseUrl + 'users', {
      headers: this.headers(password)
    }).pipe(tap(() => this.password = password));
  }

  getUsers() {
    return this.http.get<AdminUser[]>(this.baseUrl + 'users', {
      headers: this.headers()
    });
  }

  getUser(id: string) {
    return this.http.get<AdminUser>(this.baseUrl + 'users/' + id, {
      headers: this.headers()
    });
  }

  updateUser(id: string, user: AdminUpdateUser) {
    return this.http.put(this.baseUrl + 'users/' + id, user, {
      headers: this.headers()
    });
  }

  private headers(password = this.password): HttpHeaders {
    return new HttpHeaders({ 'X-Admin-Password': password });
  }
}
