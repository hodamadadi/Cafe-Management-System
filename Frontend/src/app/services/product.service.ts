import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  add(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/product/add/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  update(data: any): Observable<any> {
    console.log('Updating product data:', data);
    return this.httpClient.patch(`${this.url}/product/update/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/product/get/`);
  }

  updateStatus(data: any): Observable<any> {
    return this.httpClient.patch(`${this.url}/product/updateStatus/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${this.url}/product/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getProductsByCategory(id: any): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.url}/product/getByCategory/${id}`
    );
  }

  getById(id: any): Observable<Product> {
    return this.httpClient.get<Product>(`${this.url}/product/getById/${id}`);
  }
}
