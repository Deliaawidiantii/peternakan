import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PopulasiService {

  private apiUrl = 'http://192.168.2.114:8000/api';

 

  constructor(private http: HttpClient) {}

  // Get Headers dengan Token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get List Populasi dengan Filter
  getPopulasi(params?: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/populasi`, { headers, params });
  }

  // Create Populasi Baru
createPopulasi(data: any): Observable<any> {
  const headers = this.getHeaders();
  return this.http.post(`${this.apiUrl}/populasi`, data, { headers });
}

  // Get Detail Populasi
  getPopulasiById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/populasi/${id}`, { headers });
  }

  // Get Statistik
  getStatistik(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/populasi/statistik`, { headers });
  }

  // Get List Kategori (untuk filter)
  getKategori(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/populasi/kategori`, { headers });
  }
  // Method baru untuk get wilayah/desa
  getWilayahList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/wilayah`);
  }
}