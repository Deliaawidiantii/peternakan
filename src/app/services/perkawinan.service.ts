import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerkawinanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Ambil header Authorization dengan Bearer token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  /**
   * List data perkawinan milik petugas
   */
  index(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/perkawinan`, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  /**
   * Simpan data perkawinan baru
   * @param data - Data perkawinan yang akan dikirim ke API
   */
  store(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/perkawinan`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Detail data perkawinan
   * @param id - ID perkawinan
   */
  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/perkawinan/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Update data perkawinan
   * @param id - ID perkawinan
   * @param data - Data yang akan diupdate
   */
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perkawinan/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Hapus data perkawinan
   * @param id - ID perkawinan
   */
  destroy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perkawinan/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Statistik perkawinan
   */
  statistik(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perkawinan/statistik`, {
      headers: this.getHeaders(),
    });
  }
}
