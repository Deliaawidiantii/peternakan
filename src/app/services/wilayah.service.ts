import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // ← TAMBAHKAN INI

@Injectable({
  providedIn: 'root'
})
export class WilayahService {

  apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) { }

  getWilayah() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/wilayah`, { headers });
  }
  
  // Method public untuk register (tanpa auth)
  getPublicWilayah(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wilayah/public`);
  }
  
}