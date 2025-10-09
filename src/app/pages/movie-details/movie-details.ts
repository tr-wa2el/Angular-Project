import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieVideo, CastMember, MovieRecommendationsResponse } from '../../models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private titleService = inject(Title);
  private sanitizer = inject(DomSanitizer);

  movie: Movie | null = null;
  cast: CastMember[] = [];
  trailer: MovieVideo | null = null;
  trailerUrl: SafeResourceUrl | null = null;
  recommendedMovies: Movie[] = [];

  isLoading: boolean = true;
  error: string | null = null;
  isInWishlist: boolean = false;

  // Skeleton arrays
  skeletonCast: number[] = Array(8).fill(0);
  skeletonRecommended: number[] = Array(10).fill(0);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadMovieDetails(id);
      }
    });
  }

  loadMovieDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    // Load movie details
    this.movieService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.titleService.setTitle(`${movie.title} | Movie App`);
        this.checkWishlistStatus();
        this.isLoading = false;

        // Load additional data
        this.loadMovieVideos(id);
        this.loadMovieCast(id);
        this.loadRecommendations(id);
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
        this.error = 'Failed to load movie details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  loadMovieVideos(id: number): void {
    this.movieService.getMovieVideos(id).subscribe({
      next: (response) => {
        this.trailer = this.movieService.findOfficialTrailer(response);
        if (this.trailer) {
          const url = this.movieService.getYouTubeEmbedUrl(this.trailer.key);
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      },
      error: (err) => {
        console.error('Error loading videos:', err);
      }
    });
  }

  loadMovieCast(id: number): void {
    this.movieService.getMovieCredits(id).subscribe({
      next: (response) => {
        this.cast = response.cast.slice(0, 8); // Get top 8 cast members
      },
      error: (err) => {
        console.error('Error loading cast:', err);
      }
    });
  }

  loadRecommendations(id: number): void {
    this.movieService.getMovieRecommendations(id).subscribe({
      next: (response: MovieRecommendationsResponse) => {
        this.recommendedMovies = response.results.slice(0, 10);
      },
      error: (err) => {
        console.error('Error loading recommendations:', err);
      }
    });
  }

  get backdropUrl(): string {
    if (!this.movie) return '';
    return this.movieService.getBackdropUrl(this.movie.backdrop_path);
  }

  get posterUrl(): string {
    if (!this.movie) return '';
    return this.movieService.getPosterUrl(this.movie.poster_path);
  }

  get rating(): number {
    if (!this.movie) return 0;
    return Math.round(this.movie.vote_average * 10) / 10;
  }

  get ratingPercentage(): number {
    if (!this.movie) return 0;
    return (this.movie.vote_average / 10) * 100;
  }

  get ratingClass(): string {
    if (!this.movie) return '';
    const rating = this.movie.vote_average;
    if (rating >= 7.5) return 'rating-high';
    if (rating >= 6) return 'rating-medium';
    return 'rating-low';
  }

  get releaseYear(): string {
    if (!this.movie || !this.movie.release_date) return 'N/A';
    return new Date(this.movie.release_date).getFullYear().toString();
  }

  get runtime(): string {
    if (!this.movie || !this.movie.runtime) return 'N/A';
    return this.movieService.formatRuntime(this.movie.runtime);
  }

  get budget(): string {
    if (!this.movie) return 'N/A';
    return this.movieService.formatCurrency(this.movie.budget || 0);
  }

  get revenue(): string {
    if (!this.movie) return 'N/A';
    return this.movieService.formatCurrency(this.movie.revenue || 0);
  }

  getProfileUrl(profilePath: string | null): string {
    return this.movieService.getProfileUrl(profilePath);
  }

  toggleWishlist(): void {
    if (!this.movie) return;

    this.isInWishlist = !this.isInWishlist;

    if (this.isInWishlist) {
      this.addToWishlist();
    } else {
      this.removeFromWishlist();
    }
  }

  private checkWishlistStatus(): void {
    if (!this.movie) return;
    const wishlist = this.getWishlistFromStorage();
    this.isInWishlist = wishlist.some(id => id === this.movie!.id);
  }

  private addToWishlist(): void {
    if (!this.movie) return;
    const wishlist = this.getWishlistFromStorage();
    if (!wishlist.includes(this.movie.id)) {
      wishlist.push(this.movie.id);
      this.saveWishlistToStorage(wishlist);
      console.log('Added to wishlist:', this.movie.title);
    }
  }

  private removeFromWishlist(): void {
    if (!this.movie) return;
    let wishlist = this.getWishlistFromStorage();
    wishlist = wishlist.filter(id => id !== this.movie!.id);
    this.saveWishlistToStorage(wishlist);
    console.log('Removed from wishlist:', this.movie.title);
  }

  private getWishlistFromStorage(): number[] {
    const wishlist = localStorage.getItem('movieWishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  private saveWishlistToStorage(wishlist: number[]): void {
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { count: wishlist.length } }));
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
