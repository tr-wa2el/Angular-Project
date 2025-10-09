import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private readonly STORAGE_KEY = 'movieWishlist';
  
  // BehaviorSubject to track wishlist state
  private wishlistSubject = new BehaviorSubject<number[]>(this.loadWishlistFromStorage());
  public wishlist$ = this.wishlistSubject.asObservable();
  
  // BehaviorSubject to track wishlist count
  private countSubject = new BehaviorSubject<number>(this.loadWishlistFromStorage().length);
  public count$ = this.countSubject.asObservable();
  
  constructor() {
    // Listen to storage changes from other tabs
    if (this.isBrowser) {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY) {
          const wishlist = this.loadWishlistFromStorage();
          this.wishlistSubject.next(wishlist);
          this.countSubject.next(wishlist.length);
        }
      });
    }
  }

  /**
   * Get current wishlist as array of movie IDs
   */
  getWishlist(): number[] {
    return this.wishlistSubject.value;
  }

  /**
   * Get wishlist count
   */
  getCount(): number {
    return this.countSubject.value;
  }

  /**
   * Check if a movie is in wishlist
   */
  isInWishlist(movieId: number): boolean {
    return this.wishlistSubject.value.includes(movieId);
  }

  /**
   * Add movie to wishlist
   */
  addToWishlist(movieId: number): boolean {
    const currentWishlist = this.wishlistSubject.value;
    
    // Check if already exists
    if (currentWishlist.includes(movieId)) {
      return false;
    }
    
    // Add to wishlist
    const updatedWishlist = [...currentWishlist, movieId];
    this.saveWishlist(updatedWishlist);
    
    return true;
  }

  /**
   * Remove movie from wishlist
   */
  removeFromWishlist(movieId: number): boolean {
    const currentWishlist = this.wishlistSubject.value;
    
    // Check if exists
    if (!currentWishlist.includes(movieId)) {
      return false;
    }
    
    // Remove from wishlist
    const updatedWishlist = currentWishlist.filter(id => id !== movieId);
    this.saveWishlist(updatedWishlist);
    
    return true;
  }

  /**
   * Toggle movie in wishlist
   */
  toggleWishlist(movieId: number): boolean {
    if (this.isInWishlist(movieId)) {
      this.removeFromWishlist(movieId);
      return false;
    } else {
      this.addToWishlist(movieId);
      return true;
    }
  }

  /**
   * Clear entire wishlist
   */
  clearWishlist(): void {
    this.saveWishlist([]);
  }

  /**
   * Save wishlist to localStorage and update subjects
   */
  private saveWishlist(wishlist: number[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
    }
    
    this.wishlistSubject.next(wishlist);
    this.countSubject.next(wishlist.length);
    
    // Dispatch custom event for backward compatibility
    if (this.isBrowser) {
      window.dispatchEvent(
        new CustomEvent('wishlistUpdated', { 
          detail: { count: wishlist.length } 
        })
      );
    }
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlistFromStorage(): number[] {
    if (!this.isBrowser) {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
      return [];
    }
  }
}
