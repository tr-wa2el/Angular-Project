import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { I18nService } from '../../services/i18n.service';
import { Movie, MovieListResponse } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { BackToTopComponent } from '../../shared/components/back-to-top/back-to-top.component';

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, BackToTopComponent],
  templateUrl: './top-rated.html',
  styleUrl: './top-rated.css'
})
export class TopRatedComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private i18nService = inject(I18nService);
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

  // Subscriptions
  private routeSubscription?: Subscription;
  private languageSubscription?: Subscription;

  ngOnInit(): void {
    this.titleService.setTitle('Top Rated Movies | Movie App');

    // Subscribe to route params changes (this fires on every navigation)
    this.routeSubscription = this.route.params.subscribe(() => {
      console.log('⭐ Route activated, loading top rated movies...');
      this.loadMovies();
    });

    // Subscribe to language changes
    this.languageSubscription = this.i18nService.currentLanguage$.subscribe((lang) => {
      console.log('🌍 Language changed to:', lang, '- Reloading top rated movies...');
      this.loadMovies(this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }

  loadMovies(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.movieService.getTopRatedMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;

        // Force Angular to detect changes
        this.cdr.detectChanges();
        console.log('🔄 Top Rated: Change detection triggered');

        // Scroll to top
        if (this.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('Error loading top rated movies:', err);
        this.error = 'Failed to load top rated movies. Please try again later.';
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
