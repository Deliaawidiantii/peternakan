import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PenyakitService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });
  }

  // Get riwayat penyakit
  getPenyakit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/penyakit`, {
      headers: this.getHeaders(),
    });
  }

  // Lapor Kasus Baru (menggunakan FormData karena ada file upload "foto")
  laporKasus(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    // Content-Type dihilangkan supaya browser setting boundary form-data secara otomatis
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/penyakit`, formData, { headers });
  }

  // Update Status
  updateStatus(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/penyakit/${id}/update-status`, formData, { headers });
  }
}
