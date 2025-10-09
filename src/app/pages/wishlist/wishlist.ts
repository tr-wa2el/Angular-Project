import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WishlistService } from '../../services/wishlist.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent, MatSnackBarModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private movieService = inject(MovieService);
  private titleService = inject(Title);
  private snackBar = inject(MatSnackBar);

  movies: Movie[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  wishlistCount: number = 0;

  // Skeleton loading
  skeletonArray: number[] = Array(8).fill(0);

  ngOnInit(): void {
    this.titleService.setTitle('My Wishlist | Movie App');
    this.loadWishlistMovies();

    // Subscribe to wishlist changes
    this.wishlistService.count$.subscribe(count => {
      this.wishlistCount = count;

      // Reload movies if count changed
      if (this.movies.length !== count && !this.isLoading) {
        this.loadWishlistMovies();
      }
    });
  }

  loadWishlistMovies(): void {
    this.isLoading = true;
    this.error = null;

    const wishlistIds = this.wishlistService.getWishlist();
    this.wishlistCount = wishlistIds.length;

    console.log('🎬 Loading wishlist movies...', wishlistIds);

    if (wishlistIds.length === 0) {
      this.movies = [];
      this.isLoading = false;
      console.log('📭 Wishlist is empty');
      return;
    }

    // Fetch all movies in parallel
    const movieRequests = wishlistIds.map(id =>
      this.movieService.getMovieDetails(id).pipe(
        catchError(err => {
          console.error(`❌ Error loading movie ${id}:`, err);
          return of(null);
        })
      )
    );

    forkJoin(movieRequests).subscribe({
      next: (movies) => {
        console.log('✅ Loaded movies:', movies);
        // Filter out null values (failed requests)
        this.movies = movies.filter((movie): movie is Movie => movie !== null);
        this.isLoading = false;
        console.log('🎯 Final movies array:', this.movies);
      },
      error: (err) => {
        console.error('❌ Error loading wishlist movies:', err);
        this.error = 'Failed to load wishlist. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(movie: Movie, event: Event): void {
    event.stopPropagation();

    const removed = this.wishlistService.removeFromWishlist(movie.id);

    if (removed) {
      // Remove from local array immediately for better UX
      this.movies = this.movies.filter(m => m.id !== movie.id);

      this.snackBar.open(`${movie.title} removed from wishlist`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-info']
      });
    }
  }

  clearAllWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
      this.movies = [];

      this.snackBar.open('Wishlist cleared successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });
    }
  }

  retryLoad(): void {
    this.loadWishlistMovies();
  }
}
