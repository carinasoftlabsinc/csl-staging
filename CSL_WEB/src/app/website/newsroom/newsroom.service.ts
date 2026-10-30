import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, of } from 'rxjs';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl;
const NEWS_SUMMARY_FIELDS = '_id,title,titleLink,description,image,image_2,author,date,createdAt,updatedAt';

@Injectable({
  providedIn: 'root',
})
export class newsroomService {
  private apiurl = `${BACKEND_URL}`;

  constructor(private http: HttpClient) {}

  getFeaturedItems(): Observable<any> {
    return this.http
      .get<any>(`${this.apiurl}/admin/getAll_news?isFeature=true&fields=${NEWS_SUMMARY_FIELDS}`)
      .pipe(
        timeout(8000),
        catchError((err) => {
          console.error('Error fetching featured news items:', err);
          return of({ data: { data: [] } });
        })
      );
  }

  getPreFeaturedItems(): Observable<any> {
    return this.http
      .get<any>(`${this.apiurl}/admin/getAll_news?isPreviousFeature=true&fields=${NEWS_SUMMARY_FIELDS}`)
      .pipe(
        timeout(8000),
        catchError((err) => {
          console.error('Error fetching previous featured news items:', err);
          return of({ data: { data: [] } });
        })
      );
  }

  getAllNews(): Observable<any> {
    return this.http
      .get<any>(`${this.apiurl}/admin/getAll_news?fields=${NEWS_SUMMARY_FIELDS}`)
      .pipe(
        timeout(8000),
        catchError((err) => {
          console.error('Error fetching all news items:', err);
          return of({ data: { data: [] } });
        })
      );
  }
}
