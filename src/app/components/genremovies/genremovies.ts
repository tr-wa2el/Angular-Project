import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { MovieListResponse } from '../../shared';
import { Subscription } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genremovies',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, FormsModule],
  templateUrl: './genremovies.html',
  styleUrls: ['./genremovies.css']
})
export class Genremovies implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cdr = inject(ChangeDetectorRef);

  genres: any[] = [];
  movies: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  selectedGenreId: number | null = null;
  selectedSort: string | null = null;

  skeletonArray: number[] = Array(20).fill(0);

  private routeSubscription?: Subscription;
  private lastLog: string | null = null;

  private log(message: string) {
    if (this.lastLog !== message) {
      console.log(`[Genremovies] ${message}`);
      this.lastLog = message;
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Explore Movies | Movie App');
    this.loadGenres();

    this.routeSubscription = this.route.params.subscribe(() => {
      this.loadMovies();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadGenres(): void {
    this.movieService.getGenres().subscribe({
      next: (response: any) => {
        this.genres = response.genres;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Genremovies] Error loading genres:', err);
      }
    });
  }

  loadMovies(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    let movies$;

    // إذا هناك نوع محدد، نجلب الأفلام حسب النوع
    if (this.selectedGenreId) {
      movies$ = this.movieService.getMoviesByGenre(this.selectedGenreId, page);
    } else {
      // إذا لا نوع محدد، نستخدم الفرز العام
      switch (this.selectedSort) {
        case 'popular':
          movies$ = this.movieService.getPopularMovies(page);
          break;
        case 'top_rated':
          movies$ = this.movieService.getTopRatedMovies(page);
          break;
        case 'release_date':
          movies$ = this.movieService.getNowPlayingMovies(page);
          break;
        default:
          movies$ = this.movieService.getNowPlayingMovies(page);
      }
    }

    movies$.subscribe({
      next: (response: MovieListResponse) => {
        this.movies = response.results;

        // فرز محلي للأفلام حسب النوع
        if (this.selectedGenreId && this.selectedSort) {
          switch (this.selectedSort) {
            case 'popular':
              this.movies.sort((a, b) => b.popularity - a.popularity);
              break;
            case 'top_rated':
              this.movies.sort((a, b) => b.vote_average - a.vote_average);
              break;
            case 'release_date':
              this.movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
              break;
          }
        }

        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;
        this.cdr.detectChanges();

        if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('[Genremovies] Error loading movies:', err);
        this.error = 'Failed to load movies. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSelectGenre(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGenreId = target.value ? +target.value : null;
    this.loadMovies(1);
  }

  onSortChange(): void {
    this.loadMovies(1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadMovies(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.onPageChange(this.currentPage + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) this.onPageChange(this.currentPage - 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return pages;
  }

  scrollToTop(): void {
    if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
