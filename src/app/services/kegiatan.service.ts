import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KegiatanService {
  private apiUrl = 'http://localhost:8000/api'; // Ganti dengan URL backend Anda

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  // Get semua kegiatan
  getKegiatan(status?: string): Observable<any> {
    const url = status ? `${this.apiUrl}/kegiatan?status=${status}` : `${this.apiUrl}/kegiatan`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Get detail kegiatan by ID
  getKegiatanById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/kegiatan/${id}`, { headers: this.getHeaders() });
  }

  // Mulai kegiatan
  mulaiKegiatan(id: number) {
  const token = localStorage.getItem('token');

  return this.http.post(
    `${this.apiUrl}/kegiatan/${id}/mulai`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }
  );
}



  // Upload foto laporan
  uploadLaporan(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // JANGAN tambahkan Content-Type, biar browser yang set otomatis untuk multipart/form-data
    });
    return this.http.post(`${this.apiUrl}/kegiatan/${id}/upload-laporan`, formData, { headers });
  }

  // Selesaikan kegiatan
  selesaikanKegiatan(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/kegiatan/${id}/selesai`, {}, { headers: this.getHeaders() });
  }

  // Get statistik
  getStatistik(): Observable<any> {
    return this.http.get(`${this.apiUrl}/kegiatan/statistik`, { headers: this.getHeaders() });
  }
}