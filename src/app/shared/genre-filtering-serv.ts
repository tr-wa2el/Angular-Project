import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreFilteringServ {
  private apiKey = '47247b21145f5cac46ea5811f52f35aa';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // 🔹 جلب قائمة الأنواع (Genres)
  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }

  // 🔹 جلب جميع الأفلام (مع الترتيب والصفحة)
  getAllMovies(sortBy: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&sort_by=${sortBy}&page=${page}`
    );
  }

  // 🔹 جلب الأفلام حسب النوع والترتيب (مع الصفحة)
  getMoviesByGenreAndSort(genreId: number, sortBy: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=${sortBy}&page=${page}`
    );
  }

  // 🔹 جلب تفاصيل فيلم معين
  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`);
  }
}
