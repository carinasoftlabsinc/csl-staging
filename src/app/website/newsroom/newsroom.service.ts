import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class newsroomService {
  private apiurl = `${BACKEND_URL}`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getFeaturedItems(): Observable<any> {
    return this.http.get<any>(
      `${this.apiurl}/admin/getAll_news?isFeature=true`
    ); // Modify as per API structure
  }

   getPreFeaturedItems(): Observable<any> {
    return this.http.get<any>(
      `${this.apiurl}/admin/getAll_news?isPreviousFeature=true`
    ); // Modify as per API structure
  }

  getAllNews(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/admin/getAll_news`); // Modify as per API structure
  }
}
