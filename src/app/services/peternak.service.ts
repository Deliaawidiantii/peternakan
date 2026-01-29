import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeternakService {

  private apiUrl = 'http://localhost:8000/api'; // Ganti sesuai IP kamu


  constructor(private http: HttpClient) { }

  // Get token dari localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get headers dengan token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all peternak
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/peternak`, { 
      headers: this.getHeaders() 
    });
  }

  // Get single peternak
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/peternak/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Create peternak
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/peternak`, data, { 
      headers: this.getHeaders() 
    });
  }

  // Update peternak
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/peternak/${id}`, data, { 
      headers: this.getHeaders() 
    });
  }

  // Delete peternak
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/peternak/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}