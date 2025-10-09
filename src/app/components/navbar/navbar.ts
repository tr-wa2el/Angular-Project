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
  styleUrl: './navbar.css'
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

  ngOnInit(): void {
    // Subscribe to wishlist count changes
    this.wishlistSubscription = this.wishlistService.count$.subscribe(count => {
      this.wishlistCount = count;
    });

    // Check if user is logged in
    this.checkLoginStatus();
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      alert('Search functionality will be implemented by Search Lead (Person 4)');
      this.searchQuery = '';
    }
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  checkLoginStatus(): void {
    // Check if user is logged in by checking current user
    this.isLoggedIn = this.auth.user !== null;
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
}
