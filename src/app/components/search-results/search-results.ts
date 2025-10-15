import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { Title } from '@angular/platform-browser';
import { Movie } from '../../models/movie.model';
import { Subscription } from 'rxjs';
import { MovieListResponse } from '../../shared';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MovieCardComponent],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResults implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  movies: Movie[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  error: string | null = null;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;

  // Skeleton placeholders
  skeletonArray: number[] = Array(20).fill(0);

  private routeSub?: Subscription;

  ngOnInit(): void {
    // Listen to changes in query param (search?query=xxx)
    this.routeSub = this.route.queryParams.subscribe(params => {
      const newQuery = params['query'] || '';
      
      // Always load if there's a query, even if it's the same as before
      if (newQuery.trim()) {
        this.searchQuery = newQuery;
        this.loadMovies();
        this.titleService.setTitle(`Search: ${this.searchQuery} | Movie App`);
      } else {
        // Clear results if no query
        this.movies = [];
        this.searchQuery = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  loadMovies(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.movieService.searchMovies(this.searchQuery, page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;

        // Scroll up
        if (this.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('❌ Search error:', err);
        this.error = 'Failed to load search results. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Pagination
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
