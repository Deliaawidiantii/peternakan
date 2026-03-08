import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotifikasiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });
  }

  getNotifikasi(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifikasi?page=${page}`, {
      headers: this.getHeaders(),
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/notifikasi/${id}/read`,
      {},
      { headers: this.getHeaders() },
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/notifikasi/read-all`,
      {},
      { headers: this.getHeaders() },
    );
  }
}
