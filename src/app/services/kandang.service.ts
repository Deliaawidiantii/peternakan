import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KandangService {

  private apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) {}

  // ✅ Get Headers dengan Token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Get List Kandang
  getKandangList(params?: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/kandang`, { headers, params });
  }

  // ✅ Create Kandang - WORKING VERSION
  createKandang(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    
    console.log('🔵 Token dari localStorage:', token);
    
    // Untuk FormData, JANGAN set Content-Type
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiUrl}/kandang`, data, { headers });
  }

  // ✅ Get Detail
  getKandangById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/kandang/${id}`, { headers });
  }

  // ✅ Delete
  deleteKandang(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/kandang/${id}`, { headers });
  }
}