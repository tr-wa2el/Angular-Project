import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieListResponse } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cdr = inject(ChangeDetectorRef);

  movies: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  // Skeleton loading
  skeletonArray: number[] = Array(20).fill(0);

  // Route subscription
  private routeSubscription?: Subscription;

  ngOnInit(): void {
    this.titleService.setTitle('Now Playing Movies | Movie App');

    // Subscribe to route params (fires on every navigation to this route)
    this.routeSubscription = this.route.params.subscribe(() => {
      console.log('🏠 Route activated, loading movies...');
      this.loadMovies();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadMovies(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.movieService.getNowPlayingMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;

        // Force Angular to detect changes
        this.cdr.detectChanges();
        console.log('🔄 Home: Change detection triggered');

        // Scroll to top
        if (this.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.error = 'Failed to load movies. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadMovies(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
