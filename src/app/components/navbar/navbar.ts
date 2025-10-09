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
  private authSubscription?: Subscription;

  ngOnInit(): void {
    // Subscribe to wishlist count changes
    this.wishlistSubscription = this.wishlistService.count$.subscribe(count => {
      this.wishlistCount = count;
    });

    // Subscribe to auth state changes
    this.authSubscription = this.auth.authState$.subscribe(user => {
      this.isLoggedIn = user !== null;
      console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out');
    });
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  onSearch(event: Event) {
    event.preventDefault(); // يمنع إعادة تحميل الصفحة

    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery) {
      // يوجه المستخدم إلى صفحة البحث
      this.router.navigate(['/search'], { queryParams: { query: trimmedQuery } });
      this.searchQuery = ''; // تفريغ الحقل بعد البحث
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
}
