import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, map, of, switchMap, timeout } from 'rxjs';
import { environment } from 'environments/environment';
import { matchesSlug } from '@core/utils/slug.util';

/**
 * Loads the blog post for /blog/:title before the page is created, so the page renders with its data straight away.
 * In the browser the responses come from the server's HTTP transfer cache, so hydration keeps the server HTML
 * instead of flashing the loading skeleton. Resolves to null when the post does not exist or the API fails.
 */
export const blogPostResolver: ResolveFn<any | null> = (route) => {
  const http = inject(HttpClient);
  const titleLink = route.paramMap.get('title');
  if (!titleLink) return of(null);

  return http.get<any>(`${environment.apiUrl}/admin/getAll_blogTitles`).pipe(
    timeout(10000),
    map((res) => (res?.data ?? []).find((item: any) => matchesSlug(item, titleLink))?._id ?? null),
    switchMap((id: string | null) =>
      id ? http.get<any>(`${environment.apiUrl}/admin/get_blog/${id}`).pipe(timeout(10000)) : of(null),
    ),
    map((res) => res?.data?.data ?? null),
    catchError((err) => {
      console.error('Error loading blog post:', err);
      return of(null);
    }),
  );
};

/** "More blogs" list for the same page; resolved too, so its skeleton does not flash during hydration. */
export const moreBlogsResolver: ResolveFn<any[]> = () =>
  inject(HttpClient)
    .get<any>(`${environment.apiUrl}/admin/getAll_blog?category=web&fields=title,titleLink,category,image,image_2,author,date`)
    .pipe(
      timeout(10000),
      map((res) => res?.data?.data ?? []),
      catchError((err) => {
        console.error('Error fetching blogs:', err);
        return of([]);
      }),
    );
