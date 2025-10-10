import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  Movie,
  MovieListResponse,
  MovieCreditsResponse,
  MovieVideosResponse,
  MovieRecommendationsResponse,
} from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiService = inject(ApiService);

  /**
   * Get now playing movies
   */
  getNowPlayingMovies(page: number = 1, language: string = 'en-US'): Observable<MovieListResponse> {
    return this.apiService
      .getNowPlayingMovies(page, language)
      .pipe(map((response) => response.data));
  }

  /**
   * Get popular movies
   */
  getPopularMovies(page: number = 1, language: string = 'en-US'): Observable<MovieListResponse> {
    return this.apiService.getPopularMovies(page, language).pipe(map((response) => response.data));
  }

  /**
   * Get top rated movies
   */
  getTopRatedMovies(page: number = 1, language: string = 'en-US'): Observable<MovieListResponse> {
    return this.apiService.getTopRatedMovies(page, language).pipe(map((response) => response.data));
  }

  /**
   * Get upcoming movies
   */
  getUpcomingMovies(page: number = 1, language: string = 'en-US'): Observable<MovieListResponse> {
    return this.apiService.getUpcomingMovies(page, language).pipe(map((response) => response.data));
  }

  /**
   * Get movie details by ID
   */
  getMovieDetails(id: number, language: string = 'en-US'): Observable<Movie> {
    return this.apiService.getMovieDetails(id, language).pipe(map((response) => response.data));
  }

  /**
   * Get movie credits (cast & crew)
   */
  getMovieCredits(id: number): Observable<MovieCreditsResponse> {
    return this.apiService.getMovieCredits(id).pipe(map((response) => response.data));
  }

  /**
   * Get movie videos (trailers, teasers, etc.)
   */
  getMovieVideos(id: number, language: string = 'en-US'): Observable<MovieVideosResponse> {
    return this.apiService.getMovieVideos(id, language).pipe(map((response) => response.data));
  }

  /**
   * Get recommended movies for a specific movie
   */
  getMovieRecommendations(
    id: number,
    page: number = 1,
    language: string = 'en-US'
  ): Observable<MovieRecommendationsResponse> {
    return this.apiService
      .getMovieRecommendations(id, page, language)
      .pipe(map((response) => response.data));
  }

  /**
   * Search movies by query
   */
  searchMovies(
    query: string,
    page: number = 1,
    language: string = 'en-US'
  ): Observable<MovieListResponse> {
    return this.apiService
      .searchMovies(query, page, language)
      .pipe(map((response) => response.data));
  }

  /**
   * Get movies by genre
   */
  getMoviesByGenre(
    genreId: number,
    page: number = 1,
    language: string = 'en-US'
  ): Observable<MovieListResponse> {
    return this.apiService
      .getMoviesByGenre(genreId, page, language)
      .pipe(map((response) => response.data));
  }

  /**
   * Get movie poster URL
   */
  getPosterUrl(posterPath: string | null, size: string = 'w500'): string {
    return this.apiService.getImageUrl(posterPath || '', size);
  }

  /**
   * Get movie backdrop URL
   */
  getBackdropUrl(backdropPath: string | null, size: string = 'w1280'): string {
    return this.apiService.getBackdropUrl(backdropPath || '', size);
  }

  /**
   * Get profile image URL for cast/crew
   */
  getProfileUrl(profilePath: string | null, size: string = 'w185'): string {
    return this.apiService.getImageUrl(profilePath || '', size);
  }

  /**
   * Format runtime to hours and minutes
   */
  formatRuntime(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Get YouTube embed URL for trailer
   */
  getYouTubeEmbedUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}?autoplay=0&rel=0`;
  }

  /**
   * Find official trailer from videos
   */
  findOfficialTrailer(videos: MovieVideosResponse): MovieVideosResponse['results'][0] | null {
    if (!videos || !videos.results || videos.results.length === 0) {
      return null;
    }

    // Try to find official trailer
    const officialTrailer = videos.results.find(
      (video) => video.type === 'Trailer' && video.official && video.site === 'YouTube'
    );

    if (officialTrailer) return officialTrailer;

    // Fallback to any trailer
    const anyTrailer = videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return anyTrailer || null;
  }

  /**
   * Get list of movie genres
   */
  getGenres(language: string = 'en-US'): Observable<{ genres: { id: number; name: string }[] }> {
    return this.apiService.getGenres(language).pipe(map((response) => response.data));
  }

  
}
