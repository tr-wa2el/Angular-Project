import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../shared/authservice';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private wishlistService = inject(WishlistService);

  searchQuery = '';
  showMobileMenu = false;
  wishlistCount = 0;
  isLoggedIn = false;
  private wishlistSubscription?: Subscription;
  private authSubscription?: Subscription;

  ngOnInit(): void {
    // Subscribe to wishlist count changes
    this.wishlistSubscription = this.wishlistService.count$.subscribe(count => {
      this.wishlistCount = count;
    });

    // Subscribe to auth state changes
    this.authSubscription = this.auth.authState$.subscribe(user => {
      this.isLoggedIn = user !== null;
    });
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery) {
      this.router.navigate(['/search'], { queryParams: { query: trimmedQuery } });
      this.searchQuery = '';
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  onAuthAction(): void {
    if (this.isLoggedIn) {
      // User is logged in, logout
      this.onLogout();
    } else {
      // User is not logged in, navigate to login
      this.router.navigate(['/login']);
    }
  }

  onLogout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Even if logout fails, redirect to login
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // Navigate and force reload even if on same route
  navigateAndReload(path: string): void {
    const currentUrl = this.router.url;
    if (currentUrl === path) {
      // If already on this route, navigate to root first then back
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([path]);
      });
    } else {
      // Normal navigation
      this.router.navigate([path]);
    }
  }
}
