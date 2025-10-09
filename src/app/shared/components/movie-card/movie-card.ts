import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie.service';
import { WishlistService } from '../../../services/wishlist.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCardComponent implements OnInit, OnDestroy {
  @Input() movie!: Movie;
  @Input() showActions: boolean = true;

  private movieService = inject(MovieService);
  private wishlistService = inject(WishlistService);
  private snackBar = inject(MatSnackBar);

  isInWishlist: boolean = false;
  imageLoaded: boolean = false;
  private wishlistSubscription?: Subscription;

  ngOnInit(): void {
    // Check if movie is in wishlist
    this.checkWishlistStatus();

    // Subscribe to wishlist changes
    this.wishlistSubscription = this.wishlistService.wishlist$.subscribe(() => {
      this.checkWishlistStatus();
    });
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
  }

  get posterUrl(): string {
    return this.movieService.getPosterUrl(this.movie.poster_path);
  }

  get rating(): number {
    return Math.round(this.movie.vote_average * 10) / 10;
  }

  get ratingPercentage(): number {
    return (this.movie.vote_average / 10) * 100;
  }

  get ratingClass(): string {
    const rating = this.movie.vote_average;
    if (rating >= 7.5) return 'rating-high';
    if (rating >= 6) return 'rating-medium';
    return 'rating-low';
  }

  get releaseYear(): string {
    if (!this.movie.release_date) return 'N/A';
    return new Date(this.movie.release_date).getFullYear().toString();
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/no-poster.jpg';
    this.imageLoaded = true;
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const wasAdded = this.wishlistService.toggleWishlist(this.movie.id);

    if (wasAdded) {
      this.showNotification(`${this.movie.title} added to wishlist ❤️`, 'success');
    } else {
      this.showNotification(`${this.movie.title} removed from wishlist`, 'info');
    }
  }

  private checkWishlistStatus(): void {
    this.isInWishlist = this.wishlistService.isInWishlist(this.movie.id);
  }

  private showNotification(message: string, type: 'success' | 'info' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
