import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class API_ServiceService {
  private urlGetProduct = 'http://demo.softnix.co.th:8010/products';
  private urlGetOrder = 'http://demo.softnix.co.th:8010/orders'

constructor(private http: HttpClient) { }
  getProduct(): Observable<any[]> {
    return this.http.get<any>(this.urlGetProduct)
  }

  getOrder(): Observable<any[]> {
    return this.http.get<any>(this.urlGetOrder);
  }
}
