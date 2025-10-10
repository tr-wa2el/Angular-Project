import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieListResponse } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './popular.html',
  styleUrl: './popular.css'
})
export class PopularComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private titleService = inject(Title);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  movies: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  // Skeleton loading
  skeletonArray: number[] = Array(20).fill(0);

  // Router subscription
  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.titleService.setTitle('Popular Movies | Movie App');

    // Load movies immediately
    this.loadMovies();

    // Subscribe to router events to reload when navigating to this route
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Only reload if we're on the popular route
      if (event.urlAfterRedirects === '/popular') {
        console.log('🎬 Navigation to popular detected, reloading movies...');
        this.loadMovies(this.currentPage);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  loadMovies(page: number = 1): void {
    if (this.isLoading) {
      console.log('🎬 Already loading movies, skipping...');
      return;
    }
    this.isLoading = true;
    this.error = null;

    this.movieService.getPopularMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;

        // Scroll to top
        if (this.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('❌ Error loading popular movies:', err);
        this.error = 'Failed to load popular movies. Please try again later.';
        this.isLoading = false;
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
