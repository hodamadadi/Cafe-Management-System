import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  // Fetch categories from the server
  getCategory(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}/category/get/`);
  }

  // Add a new category
  add(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/category/add/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  // Update an existing category
  update(data: any): Observable<any> {
    return this.httpClient.patch(`${this.url}/category/update/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
