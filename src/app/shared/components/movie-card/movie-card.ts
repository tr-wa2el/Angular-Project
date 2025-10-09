import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() showActions: boolean = true;
  
  private movieService = inject(MovieService);
  
  isInWishlist: boolean = false;
  imageLoaded: boolean = false;

  ngOnInit(): void {
    // Check if movie is in wishlist
    this.checkWishlistStatus();
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
    
    this.isInWishlist = !this.isInWishlist;
    
    if (this.isInWishlist) {
      this.addToWishlist();
    } else {
      this.removeFromWishlist();
    }
  }

  private checkWishlistStatus(): void {
    const wishlist = this.getWishlistFromStorage();
    this.isInWishlist = wishlist.some(id => id === this.movie.id);
  }

  private addToWishlist(): void {
    const wishlist = this.getWishlistFromStorage();
    if (!wishlist.includes(this.movie.id)) {
      wishlist.push(this.movie.id);
      this.saveWishlistToStorage(wishlist);
      // TODO: Show success notification
      console.log('Added to wishlist:', this.movie.title);
    }
  }

  private removeFromWishlist(): void {
    let wishlist = this.getWishlistFromStorage();
    wishlist = wishlist.filter(id => id !== this.movie.id);
    this.saveWishlistToStorage(wishlist);
    // TODO: Show info notification
    console.log('Removed from wishlist:', this.movie.title);
  }

  private getWishlistFromStorage(): number[] {
    const wishlist = localStorage.getItem('movieWishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  private saveWishlistToStorage(wishlist: number[]): void {
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist));
    // Dispatch custom event to update wishlist counter in navbar
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { count: wishlist.length } }));
  }
}
