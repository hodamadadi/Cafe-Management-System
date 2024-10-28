import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bill } from '../../app/services/models/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  generateReport(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/bill/generateReport/`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getPDF(data: any): Observable<Blob> {
    return this.httpClient.post<Blob>(`${this.url}/bill/getPdf`, data, {
      responseType: 'blob' as 'json',
    });
  }

  getBills(): Observable<Bill[]> {
    return this.httpClient.get<Bill[]>(`${this.url}/bill/getBills/`);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/bill/delete/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
