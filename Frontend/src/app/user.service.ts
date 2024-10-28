import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://your-api-url.com/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  update(data: any): Observable<any> { 
    return this.http.put<any>(`${this.apiUrl}/users/update`, data);
  }
}
