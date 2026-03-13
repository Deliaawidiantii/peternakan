import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MutasiService {
  private apiUrl = environment.apiUrl + '/mutasi';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  // Get all mutasi
  getMutasi(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get mutasi by ID
  getMutasiById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Create mutasi (pindah, mati, hilang, dipotong)
  createMutasi(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  // Update mutasi
  updateMutasi(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  // Delete mutasi
  deleteMutasi(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Get mutasi by jenis (type)
  getMutasiByJenis(jenis: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?jenis=${jenis}`, { headers: this.getHeaders() });
  }
}
