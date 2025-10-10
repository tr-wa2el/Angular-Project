import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiNodes, ApiNodeKey } from './api-nodes';
import { I18nService } from './i18n.service';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  fromMock?: boolean;
}

export interface MovieListResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private i18nService = inject(I18nService);
  private baseUrl = environment.tmdbApiBaseUrl;
  private apiKey = environment.tmdbApiKey;

  // Flag to easily switch between real API and mock data
  private useMock = false; // Set to true to always use mock data

  constructor() {}

  /**
   * Generic method to make API calls with automatic fallback to mock data
   */
  private makeRequest<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    nodeKey?: ApiNodeKey
  ): Observable<ApiResponse<T>> {
    // Add API key to all requests
    params = params.set('api_key', this.apiKey);

    // Add language parameter if not already set
    if (!params.has('language')) {
      const apiLanguage = this.i18nService.getApiLanguageCode();
      params = params.set('language', apiLanguage);
    }

    // If mock mode is enabled, return mock data immediately
    if (this.useMock && nodeKey) {
      return of({
        data: ApiNodes[nodeKey].mockData as T,
        status: 200,
        fromMock: true
      });
    }

    const fullUrl = `${this.baseUrl}${endpoint}`;

    return this.http.get<T>(fullUrl, { params, observe: 'response' }).pipe(
      map(response => ({
        data: response.body as T,
        status: response.status,
        fromMock: false
      })),
      catchError((error: HttpErrorResponse) => {
        console.warn('API request failed, falling back to mock data:', error);

        // Return mock data as fallback
        if (nodeKey && ApiNodes[nodeKey]) {
          return of({
            data: ApiNodes[nodeKey].mockData as T,
            status: 200,
            message: 'Fallback to mock data due to API error',
            fromMock: true
          });
        }

        // If no mock data available, throw the error
        throw error;
      })
    );
  }

  // Movies API methods
  getPopularMovies(page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/movie/popular', params, 'getPopularMovies');
  }

  getTopRatedMovies(page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/movie/top_rated', params, 'getTopRatedMovies');
  }

  getNowPlayingMovies(page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/movie/now_playing', params, 'getNowPlayingMovies');
  }

  getUpcomingMovies(page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/movie/upcoming', params, 'getUpcomingMovies');
  }

  getMovieDetails(id: number, language: string = 'en-US'): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('language', language);
    const endpoint = `/movie/${id}`;

    return this.makeRequest<any>(endpoint, params, 'getMovieDetails');
  }

  getMovieCredits(id: number): Observable<ApiResponse<any>> {
    const endpoint = `/movie/${id}/credits`;
    return this.makeRequest<any>(endpoint, new HttpParams(), 'getMovieCredits');
  }

  getMovieVideos(id: number, language: string = 'en-US'): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('language', language);
    const endpoint = `/movie/${id}/videos`;

    return this.makeRequest<any>(endpoint, params, 'getMovieVideos');
  }

  getMovieRecommendations(id: number, page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);
    const endpoint = `/movie/${id}/recommendations`;

    return this.makeRequest<MovieListResponse>(endpoint, params, 'getPopularMovies');
  }

  searchMovies(query: string, page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/search/movie', params, 'searchMovies');
  }

  getGenres(language: string = 'en-US'): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('language', language);
    return this.makeRequest<any>('/genre/movie/list', params, 'getGenres');
  }

  getMoviesByGenre(genreId: number, page: number = 1, language: string = 'en-US'): Observable<ApiResponse<MovieListResponse>> {
    const params = new HttpParams()
      .set('with_genres', genreId.toString())
      .set('page', page.toString())
      .set('language', language);

    return this.makeRequest<MovieListResponse>('/discover/movie', params, 'getPopularMovies');
  }

  // Utility methods
  enableMockMode(): void {
    this.useMock = true;
    console.log('Mock mode enabled - all API calls will return mock data');
  }

  disableMockMode(): void {
    this.useMock = false;
    console.log('Mock mode disabled - API calls will attempt real endpoints with fallback');
  }

  isMockModeEnabled(): boolean {
    return this.useMock;
  }

  // Helper method to build image URLs
  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/assets/images/no-image.jpg';
    return `${environment.tmdbImageBaseUrl.replace('w500', size)}${path}`;
  }

  // Helper method to get full backdrop URL
  getBackdropUrl(path: string, size: string = 'w1280'): string {
    if (!path) return '/assets/images/no-backdrop.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}
